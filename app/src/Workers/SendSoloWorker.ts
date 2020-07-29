import { TextChannel, Client } from 'discord.js'
import NekoClient from 'nekos.life'

class SendSoloWorker {
  HChannelId: string
  constructor (HChannelId: string) {
    this.HChannelId = HChannelId
  }

  public async sendSolo (client: Client) {
    const nekosLifeClient = new NekoClient()
    const res = await nekosLifeClient.nsfw.girlSolo()
    const channel = client.channels.cache.get(this.HChannelId) as TextChannel
    channel.send(res.url)
  }
}

export default SendSoloWorker
