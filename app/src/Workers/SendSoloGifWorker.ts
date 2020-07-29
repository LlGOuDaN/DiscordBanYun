import { TextChannel, Client } from 'discord.js'
import NekoClient from 'nekos.life'

class SendSoloGifWorker {
    HChannelId: string
    constructor (HChannelId: string) {
      this.HChannelId = HChannelId
    }

    public async sendSoloGif (client: Client) {
      const nekosLifeClient = new NekoClient()
      const res = await nekosLifeClient.nsfw.girlSoloGif()
      const channel = client.channels.cache.get(this.HChannelId) as TextChannel
      channel.send(res.url)
    }
}

export default SendSoloGifWorker
