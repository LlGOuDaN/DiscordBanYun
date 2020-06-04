import { TextChannel, Client } from 'discord.js'
import Pix from 'pixiv-app-api'
import PixImg from 'pixiv-img'
import * as datefns from 'date-fns'

const HChannelId = '547540063584518144'

class App {
  public run () {
    const client = new Client()
    client.once('ready', () => {
      const channel = client.channels.cache.get(HChannelId) as TextChannel
      channel.send('搬运开始了')
      this.setupScheduledSent(client)
    })

    client.on('message', message => {
      const inputMessage = message.content
      if (inputMessage === '!pic') {
        this.sendRandom(client)
      } else if (inputMessage.match(/!search \w*/g)) {
        this.searchImg(client, inputMessage.substring(8))
      }
    })

    client.login(process.env.DISCORD_BOT_TOKEN)
  }

  private async searchImg (client: Client, tag?: string, index?: number) {
    const illusts = []
    const follows = ['1000', '5000', '10000', '50000']
    const channel = client.channels.cache.get(HChannelId) as TextChannel
    const pix = new Pix()
    const jsons = await Promise.all(follows.map(fo => this.searchIllustration(pix, tag || '', fo)))
    jsons.forEach((json) => {
      illusts.push(...json.illusts)
    }
    )
    const randomIndex = Math.floor(Math.random() * illusts.length)
    await PixImg(illusts[index || randomIndex].imageUrls.large, './r18.png')
    await channel.send({ files: ['./r18.png'] })
  }

  private async searchIllustration (pix: Pix, tag: string, numOfFavs: string) {
    await pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    const randomOffset = datefns.getMilliseconds(new Date())
    const searchTag = numOfFavs + 'users入り R-18 -腐向け ' + tag
    const json = await pix.searchIllust(searchTag, { offset: randomOffset, type: 'illust' })
    return json
  }

  private async sendDailyR18Img (client: Client) {
    const channel = client.channels.cache.get(HChannelId) as TextChannel
    const pix = new Pix()
    await pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    const json = await pix.illustRanking({ mode: 'week_r18' })
    const illusts = json.illusts
    const randomIndex = datefns.getDay(new Date()) % 30
    await PixImg(illusts[randomIndex].imageUrls.large, './r18.png')
    await channel.send({ files: ['./r18.png'] })
  }

  private sendRandom (client: Client) {
    this.searchImg(client)
  }

  private setupScheduledSent (client: Client, timePeriod?: number) {
    const DayInMilliseconds = 1000 * 60 * 60 * 24
    client.setInterval(() => {
      const channel = client.channels.cache.get(HChannelId) as TextChannel
      channel.send('每日任务？')
      this.sendDailyR18Img(client)
    }, timePeriod || DayInMilliseconds)
  }
}

export default App
