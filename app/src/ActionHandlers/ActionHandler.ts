import { Client } from 'discord.js'
import LastMessageManager from '../LastMessageManager'

class ActionHandler {
   client: Client

   constructor (client: Client) {
     this.client = client
   }

   public async handle (channelId: string) {
     console.info('No Command Match on ' + channelId)
   }

   public isRecallable () {
     return false
   }
}

export default ActionHandler
