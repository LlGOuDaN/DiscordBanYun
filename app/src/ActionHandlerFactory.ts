import PicActionHandler from './ActionHandlers/PicActionHandler'
import { Client } from 'discord.js'
import ActionHandler from './ActionHandlers/ActionHandler'
import SearchActionHandler from './ActionHandlers/SearchActionHandler'
import TagActionHandler from './ActionHandlers/TagActionHandler'
import TrendActionHandler from './ActionHandlers/TrendActionHandler'
import SoloGifActionHandler from './ActionHandlers/SoloGifActionHandler'
import SoloActionHandler from './ActionHandlers/SoloActionHandler'
import PicTagActionHandler from './ActionHandlers/PicTagActionHandler'

class ActionHandlerFactory {
    client: Client
    inputMessage:string

    constructor (client: Client, inputMessage: string) {
      this.client = client
      this.inputMessage = inputMessage
    }

    public createActionHandler (): ActionHandler {
      if (this.inputMessage === '!pic') {
        return new PicActionHandler(this.client)
      }
      if (this.inputMessage.match(/!search \w*/g)) {
        return new SearchActionHandler(this.client, this.inputMessage.substring(8))
      }
      if (this.inputMessage.match(/!tag \w*/g)) {
        return new TagActionHandler(this.client, this.inputMessage.substring(5))
      }
      if (this.inputMessage === '!trend') {
        return new TrendActionHandler(this.client)
      }
      if (this.inputMessage === '!sologif') {
        return new SoloGifActionHandler(this.client)
      }
      if (this.inputMessage === '!solo') {
        return new SoloActionHandler(this.client)
      }
      if (this.inputMessage === '!pictag') {
        return new PicTagActionHandler(this.client)
      }

      return new ActionHandler(this.client)
    }
}

export default ActionHandlerFactory
