import { TextChannel, Client } from 'discord.js'
import Pix from 'pixiv-app-api'
import PixImg from 'pixiv-img'
import * as datefns from 'date-fns'

const HChannelId = '547540063584518144'
class App {
  public run () {
    const client = new Client()
    client.once('ready', () => {
      const channel = client.channels.cache.get(HChannelId) as TextChannel
      channel.send('搬运开始了')
      this.setupScheduledSent(client)
    })

    client.on('message', message => {
      switch (message.content) {
        case '!pic':
          this.sendRandom(client)
      }
    })

    client.login(process.env.DISCORD_BOT_TOKEN)
  }

  private sendR18Img (client: Client, mode?: any, index?: number) {
    const channel = client.channels.cache.get(HChannelId) as TextChannel
    const pix = new Pix()
    pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD).then(() => {
      pix.illustRanking({ mode: mode || 'week_r18' }).then((json) => {
        const illusts = json.illusts
        const randomIndex = datefns.getDay(new Date()) % 30
        PixImg(illusts[index || randomIndex].imageUrls.large, './r18.png').then(() => {
          channel.send({ files: ['./r18.png'] })
        })
      })
    })
  }

  private sendRandom (client: Client) {
    this.sendR18Img(client, 'month', Math.floor(Math.random() * 30))
  }

  private setupScheduledSent (client:Client, timePeriod?: number) {
    const DayInMilliseconds = 1000 * 60 * 60 * 24
    client.setInterval(() => {
      const channel = client.channels.cache.get(HChannelId) as TextChannel
      channel.send('每日任务？')
      this.sendR18Img(client)
    }, timePeriod || DayInMilliseconds)
  }
}

export default App
