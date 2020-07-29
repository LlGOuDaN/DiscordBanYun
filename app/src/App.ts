import { TextChannel, Client } from 'discord.js'
import ActionHandlerFactory from './ActionHandlerFactory'
import ImageSearchWorker from './Workers/ImageSearchWorker'

let HChannelId = '547540063584518144'
const TestChannelId = '719346869611790376'
const testing = false

class App {
  public run () {
    if (testing) {
      HChannelId = TestChannelId
    }
    const client = new Client()
    client.once('ready', () => {
      const channel = client.channels.cache.get(HChannelId) as TextChannel
      channel.send('搬运开始了')
      const imageSearchWorker = new ImageSearchWorker(HChannelId)
      imageSearchWorker.sendDailyR18Img(client)
      this.setupScheduledSent(client)
    })
    // this.getSource()
    client.on('message', message => {
      const inputMessage = message.content
      if ((!testing || message.channel.id !== TestChannelId) && (testing || message.channel.id !== HChannelId)) {
        return
      }
      const actionHandlerFactory = new ActionHandlerFactory(client, inputMessage)
      const actionHandler = actionHandlerFactory.createActionHandler()
      actionHandler.handle(HChannelId)
    })

    client.login(process.env.DISCORD_BOT_TOKEN)
  }

  private setupScheduledSent (client: Client, timePeriod?: number) {
    const DayInMilliseconds = 1000 * 60 * 60 * 24
    const imageSearchWorker = new ImageSearchWorker(HChannelId)
    client.setInterval(() => {
      imageSearchWorker.sendDailyR18Img(client)
    }, timePeriod || DayInMilliseconds)
  }
}

export default App
