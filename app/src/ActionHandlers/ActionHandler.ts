import { Client } from 'discord.js'

class ActionHandler {
   client: Client

   constructor (client: Client) {
     this.client = client
   }

   public handle (channelId: string) {
     console.info('No Command Match on ' + channelId)
   }
}

export default ActionHandler
