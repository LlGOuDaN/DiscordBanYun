import { TextChannel, Client } from 'discord.js'
import ActionHandlerFactory from './ActionHandlerFactory'
import ImageSearchWorker from './Workers/ImageSearchWorker'
import LastMessageManager from './LastMessageManager'

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
      // console.log(message.attachments.size)
      if (message.attachments.size) {
        message.react('❤️')
      }
      const inputMessage = message.content
      if ((!testing || message.channel.id !== TestChannelId) && (testing || message.channel.id !== HChannelId)) {
        return
      }
      const actionHandlerFactory = new ActionHandlerFactory(client, inputMessage)
      const actionHandler = actionHandlerFactory.createActionHandler()
      if (actionHandler.isRecallable()) {
        const lastMessageManager = LastMessageManager.getInstance()
        lastMessageManager.setLastActionHandler(actionHandler)
      }
      actionHandler.handle(HChannelId)
    })
    client.on('messageReactionAdd', (reaction, user) => {
      const message = reaction.message; const emoji = reaction.emoji
      if (message.attachments.size) {
        if (emoji.name === '❤️') {
          console.log(user.username)
          const content = message.content.split('/')
          console.log(content[content.length - 1])
        }
      }
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
