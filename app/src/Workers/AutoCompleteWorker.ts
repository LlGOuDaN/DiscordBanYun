import { TextChannel, Client } from 'discord.js'
import Pix from 'pixiv-app-api'

class AutoCompleteWorker {
  HChannelId: string
  constructor (HChannelId: string) {
    this.HChannelId = HChannelId
  }

  public async autoComplete (client: Client, tag: string) {
    const channel = await client.channels.cache.get(this.HChannelId) as TextChannel
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
}

export default AutoCompleteWorker
