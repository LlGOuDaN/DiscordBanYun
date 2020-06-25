import { TextChannel, Client } from 'discord.js'
import Pix from 'pixiv-app-api'
import PixImg from 'pixiv-img'
import * as datefns from 'date-fns'
import NekoClient from 'nekos.life'

let HChannelId = '547540063584518144'
const TestChannelId = '719346869611790376'
const testing = false

class App {
  public run () {
    if (testing) {
      HChannelId = TestChannelId
    }
    const client = new Client()
    client.once('ready', () => {
      const channel = client.channels.cache.get(HChannelId) as TextChannel
      channel.send('搬运开始了')
      this.sendDailyR18Img(client)
      this.setupScheduledSent(client)
    })
    // this.getSource()
    client.on('message', message => {
      const inputMessage = message.content
      if ((!testing || message.channel.id !== TestChannelId) && (testing || message.channel.id !== HChannelId)) {
        return
      }
      if (inputMessage === '!pic') {
        this.searchImg(client)
      } else if (inputMessage.match(/!search \w*/g)) {
        this.searchImg(client, inputMessage.substring(8))
      } else if (inputMessage.match(/!tag \w*/g)) {
        this.autoComplete(client, inputMessage.substring(5))
      } else if (inputMessage === '!trend') {
        this.trendTags(client)
      } else if (inputMessage === '!sologif') {
        this.sendSoloGif(client)
      } else if (inputMessage === '!solo') {
        this.sendSolo(client)
      } else if (inputMessage === '!pictag') {
        this.searchImg(client, '', true)
      }
    })

    client.login(process.env.DISCORD_BOT_TOKEN)
  }

  private async searchImg (client: Client, tag?: string, withTag?: boolean) {
    let follows = '0'
    if (!tag) {
      follows = '00'
    }
    if (withTag) {
      const lspTags = process.env.PIXIV_TAG.split('%').join(' ')
      tag += lspTags
    }
    const channel = client.channels.cache.get(HChannelId) as TextChannel
    const pix = new Pix()
    const json = await this.searchIllustration(pix, tag || '', follows)
    const illusts = json.illusts
    if (illusts.length === 0) {
      await channel.send('没找到图 1551')
      return
    }
    let randomIndex = Math.floor(Math.random() * illusts.length)
    let validImage = false
    for (let i = 0; i < illusts.length; i++) {
      if (illusts[(randomIndex) % illusts.length].totalBookmarks >= 1000) {
        validImage = true
        break
      }
      randomIndex++
    }
    if (!validImage) {
      await channel.send('没找到图 1551')
      return
    }

    await PixImg(illusts[randomIndex].imageUrls.large, './r18.png')
    await channel.send({ files: ['./r18.png'] })
    await this.sendImageInfo(illusts[randomIndex], channel)
  }

  private async sendImageInfo (illust: any, channel: any) {
    let output = ''
    output += illust.title + '\n'
    const tagList = illust.tags
    tagList.forEach(tagInfo => {
      output += tagInfo.name + ', '
    }
    )
    output = output.substring(0, output.length - 2)
    output += '\n'
    output += 'Number of Favorites: ' + illust.totalBookmarks + '\n'
    output += 'https://www.pixiv.net/artworks/' + illust.id
    await channel.send(output)
  }

  private async searchIllustration (pix: Pix, tag: string, numOfFavs: string) {
    await pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    let randomOffset = datefns.getMilliseconds(new Date())
    randomOffset = Math.floor(randomOffset)
    const blockTag = process.env.PIXIV_BLOCK_TAG.split('%').join(' ')
    const searchTag = numOfFavs + '00users入り R-18 ' + blockTag + ' ' + tag
    let json = null
    while (!json || !json.illusts.length) {
      json = await pix.searchIllust(searchTag, { offset: randomOffset, type: 'illust' })
      if (randomOffset > 0) {
        randomOffset /= 2
        randomOffset = Math.floor(randomOffset)
      } else {
        break
      }
    }
    return json
  }

  private async trendTags (client: Client) {
    const channel = await client.channels.cache.get(HChannelId) as TextChannel
    const pix = new Pix()
    await pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    const trendingResult = await pix.trendingTagsIllust({ mode: 'day_r18' })
    // @ts-ignore
    const tagList = trendingResult.trendTags as any[]
    if (!tagList.length) {
      await channel.send('没找到Tag 1551')
      return
    }
    let output = 'Daily R-18 Trending Tags:\n'
    tagList.forEach(tagInfo => {
      output += tagInfo.tag + '\n'
    }
    )
    await channel.send(output)
  }

  private async autoComplete (client: Client, tag: string) {
    const channel = await client.channels.cache.get(HChannelId) as TextChannel
    const pix = new Pix()
    await pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    const autoCompleteResult = await pix.searchAutoComplete(tag)
    const tagList = autoCompleteResult.searchAutoCompleteKeywords
    if (!tagList.length) {
      await channel.send('没找到Tag 1551')
      return
    }
    await channel.send(tagList)
  }

  private async sendDailyR18Img (client: Client) {
    const channel = client.channels.cache.get(HChannelId) as TextChannel
    await channel.send('每日任务？')
    const pix = new Pix()
    await pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    const json = await pix.illustRanking({ mode: 'week_r18' })
    const illusts = json.illusts
    const randomIndex = datefns.getDay(new Date()) % 30
    await PixImg(illusts[randomIndex].imageUrls.large, './r18.png')
    await channel.send({ files: ['./r18.png'] })
    await this.sendImageInfo(illusts[randomIndex], channel)
  }

  private setupScheduledSent (client: Client, timePeriod?: number) {
    const DayInMilliseconds = 1000 * 60 * 60 * 24
    client.setInterval(() => {
      this.sendDailyR18Img(client)
    }, timePeriod || DayInMilliseconds)
  }

  private async sendSoloGif (client: Client) {
    const nekosLifeClient = new NekoClient()
    const res = await nekosLifeClient.nsfw.girlSoloGif()
    const channel = client.channels.cache.get(HChannelId) as TextChannel
    channel.send(res.url)
  }

  private async sendSolo (client: Client) {
    const nekosLifeClient = new NekoClient()
    const res = await nekosLifeClient.nsfw.girlSolo()
    const channel = client.channels.cache.get(HChannelId) as TextChannel
    channel.send(res.url)
  }
}

export default App
