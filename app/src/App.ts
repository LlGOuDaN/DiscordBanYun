import { TextChannel, Client, Channel } from 'discord.js'
import ActionHandlerFactory from './ActionHandlerFactory'
import ImageSearchWorker from './Workers/ImageSearchWorker'
import LastMessageManager from './LastMessageManager'
import { Console } from 'console'

let HChannelId = '547540063584518144'
const GREChannelId = '743336861409214555'
const TestChannelId = '719346869611790376'
const testing = true

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
      if (message.attachments.size && message.member.user.username === 'BanYun') {
        console.log('Sender username', message.member.user.username)
        console.log('Sender equal banyun', message.member.user.username === 'BanYun')
        message.react('❤️')
      }
      const inputMessage = message.content
      if (message.channel.id === GREChannelId) {
        if (message.toString() === '!GRE') {
          const LGDGREDGL = client.channels.cache.get(GREChannelId) as TextChannel
          LGDGREDGL.send('李狗蛋做题了吗')
        }
      }
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
          // console.log(user.username)
          const content = message.content.split('/')
          // ID of the image
          // console.log(content[content.length - 1])
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
