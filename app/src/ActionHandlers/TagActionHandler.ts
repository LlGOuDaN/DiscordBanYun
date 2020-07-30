import ActionHandler from './ActionHandler'
import { Client } from 'discord.js'
import AutoCompleteWorker from '../Workers/AutoCompleteWorker'

class TagActionHandler extends ActionHandler {
    tag: string
    constructor (client: Client, tag: string) {
      super(client)
      this.tag = tag
    }

    public handle (channelId: string) {
      const autoCompleteWorker = new AutoCompleteWorker(channelId)
      autoCompleteWorker.autoComplete(this.client, this.tag)
    }

    public isRecallable () {
      return true
    }
}

export default TagActionHandler
