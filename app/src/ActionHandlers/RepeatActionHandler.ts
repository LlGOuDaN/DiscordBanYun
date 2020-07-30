import ActionHandler from './ActionHandler'
import LastMessageManager from '../LastMessageManager'
const fs = require('fs')

class RepeatActionHandler extends ActionHandler {
  public handle (channelId: string) {
    console.log('RepeatAction')
    const lastMessageManager = LastMessageManager.getInstance()
    const lastActionHandler = lastMessageManager.getLastActionHandler() || new ActionHandler(this.client)
    lastActionHandler.handle(channelId)
  }
}
export default RepeatActionHandler
