import { Client, TextChannel } from 'discord.js'
import Pix from 'pixiv-app-api'
import PixImg from 'pixiv-img'
import * as datefns from 'date-fns'

class ImageSearchWorker {
  HChannelId: string
  constructor (HChannelId: string) {
    this.HChannelId = HChannelId
  }

  public async searchImg (client: Client, tag?: string, withTag?: boolean) {
    let follows = '0'
    if (!tag) {
      follows = '00'
    }
    if (withTag) {
      const lspTags = process.env.PIXIV_TAG.split('%')
      const randomTagIndex = Math.floor(Math.random() * lspTags.length)
      tag += lspTags[randomTagIndex] + ' '
    }
    const channel = client.channels.cache.get(this.HChannelId) as TextChannel
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
    const imageInfo = await this.getImageInfo(illusts[randomIndex])
    await channel.send(imageInfo, { files: ['./r18.png'] })
  }

  public async sendDailyR18Img (client: Client) {
    const channel = client.channels.cache.get(this.HChannelId) as TextChannel
    await channel.send('每日任务？')
    const pix = new Pix()
    await pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    const json = await pix.illustRanking({ mode: 'week_r18' })
    const illusts = json.illusts
    const randomIndex = datefns.getDay(new Date()) % 30
    await PixImg(illusts[randomIndex].imageUrls.large, './r18.png')
    const imageInfo = await this.getImageInfo(illusts[randomIndex])
    await channel.send(imageInfo, { files: ['./r18.png'] })
  }

  private async searchIllustration (pix: Pix, tag: string, numOfFavs: string) {
    await pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
    let randomOffset = datefns.getMilliseconds(new Date())
    randomOffset = Math.floor(randomOffset)
    const blockTag = process.env.PIXIV_BLOCK_TAG.split('%').join(' ')
    const searchTag = numOfFavs + '00users入り R-18 ' + blockTag + ' ' + tag
    console.info(searchTag)
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

  private async getImageInfo (illust: any) {
    let output = ''
    output += '**' + illust.title + '**' + '\n'
    const tagList = illust.tags
    tagList.forEach(tagInfo => {
      output += tagInfo.name + ', '
    }
    )
    output = output.substring(0, output.length - 2)
    output += '\n'
    output += 'Number of Favorites: ' + illust.totalBookmarks + '\n'
    output += 'https://www.pixiv.net/artworks/' + illust.id
    return output
  }
}

export default ImageSearchWorker
