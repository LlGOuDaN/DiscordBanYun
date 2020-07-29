import ActionHandler from './ActionHandler'
import ImageSearchWorker from '../Workers/ImageSearchWorker'
import { Client } from 'discord.js'

class SearchActionHandler extends ActionHandler {
    tag: string
    constructor (client: Client, tag: string) {
      super(client)
      this.tag = tag
    }

    public handle (channelId: string) {
      const imageSearchWorker = new ImageSearchWorker(channelId)
      imageSearchWorker.searchImg(this.client, this.tag)
    }
}

export default SearchActionHandler
