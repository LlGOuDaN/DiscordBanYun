import ActionHandler from './ActionHandler'
import LastMessageManager from '../LastMessageManager'
import { Client } from 'discord.js'
const fs = require('fs')

class RepeatActionHandler extends ActionHandler {
  repeatTimes: number
  constructor (client: Client, repeatTimes: number) {
    super(client)
    this.repeatTimes = repeatTimes || 1
    if (this.repeatTimes > 10) {
      this.repeatTimes = 10
    }
  }

  public async handle (channelId: string) {
    console.log('RepeatAction')
    const lastMessageManager = LastMessageManager.getInstance()
    const lastActionHandler = lastMessageManager.getLastActionHandler() || new ActionHandler(this.client)
    var i: number
    for (i = 0; i < this.repeatTimes; i++) {
      await lastActionHandler.handle(channelId)
    }
  }
}
export default RepeatActionHandler
