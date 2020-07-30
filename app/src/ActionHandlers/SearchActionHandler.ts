import ActionHandler from './ActionHandler'
import ImageSearchWorker from '../Workers/ImageSearchWorker'
import { Client } from 'discord.js'

class SearchActionHandler extends ActionHandler {
    tag: string
    constructor (client: Client, tag: string) {
      super(client)
      this.tag = tag
    }

    public async handle (channelId: string) {
      const imageSearchWorker = new ImageSearchWorker(channelId)
      await imageSearchWorker.searchImg(this.client, this.tag)
    }

    public isRecallable () {
      return true
    }
}

export default SearchActionHandler
