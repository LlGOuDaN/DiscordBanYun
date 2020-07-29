import { TextChannel, Client } from 'discord.js'
import Pix from 'pixiv-app-api'

class TrendTagsWorker {
  HChannelId: string
  constructor (HChannelId: string) {
    this.HChannelId = HChannelId
  }

  public async trendTags (client: Client) {
    const channel = await client.channels.cache.get(this.HChannelId) as TextChannel
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
}

export default TrendTagsWorker
