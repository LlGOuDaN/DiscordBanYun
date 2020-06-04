import {TextChannel, Client} from 'discord.js'
import Pix from 'pixiv-app-api'
import PixImg from 'pixiv-img'
import * as datefns from 'date-fns'

const HChannelId = '547540063584518144'

class App {
    public run() {
        const client = new Client()
        client.once('ready', () => {
            const channel = client.channels.cache.get(HChannelId) as TextChannel
            channel.send('搬运开始了')
            this.setupScheduledSent(client)
        })

        client.on('message', message => {
            const inputMessage = message.content;
            if (inputMessage.substr(0, 4) === '!pic') {
                this.sendRandom(client)
            } else if (inputMessage.substr(0, 7) === '!search') {
                this.searchImg(client, inputMessage.substring(8))
            }
        })

        client.login(process.env.DISCORD_BOT_TOKEN)
    }


    private searchImg(client: Client, tag: string, index?: number) {
        const channel = client.channels.cache.get(HChannelId) as TextChannel
        const pix = new Pix()
        // pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD).then(() => {
        Promise.all([this.searchIllustration(pix, tag, '1000'),
            this.searchIllustration(pix, tag, '5000'),
            this.searchIllustration(pix, tag, '10000'),
            this.searchIllustration(pix, tag, '50000')
        ]).then((jsons) => {
                // console.log(jsons)
                let illusts = []
                jsons.forEach((json) => {
                        illusts.push(...json.illusts)
                    }
                )
                // console.log(illusts)
                // console.log(illusts.length)
                const randomIndex = Math.floor(Math.random() * illusts.length)
                PixImg(illusts[index || randomIndex].imageUrls.large, './r18.png').then(() => {
                    channel.send({files: ['./r18.png']})
                })
            }
        )
    }

    private async searchIllustration(pix: Pix, tag: string, numOfFavs: string) {
        await pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD)
        const randomOffset = datefns.getMilliseconds(new Date())
        const searchTag = numOfFavs + 'users入り R-18 ' + tag
        let json = await pix.searchIllust(searchTag,{offset: randomOffset, type: 'illust'})
        return json
    }


    private sendR18Img(client: Client, mode?: any, index?: number) {
        const channel = client.channels.cache.get(HChannelId) as TextChannel
        const pix = new Pix()
        pix.login(process.env.PIXIV_USERNAME, process.env.PIXIV_PASSWORD).then(() => {
            pix.illustRanking({mode: mode || 'week_r18'}).then((json) => {
                const illusts = json.illusts
                const randomIndex = datefns.getDay(new Date()) % 30
                PixImg(illusts[index || randomIndex].imageUrls.large, './r18.png').then(() => {
                    channel.send({files: ['./r18.png']})
                })
            })
        })
    }

    private sendRandom(client: Client) {
        this.sendR18Img(client, 'month', Math.floor(Math.random() * 30))
    }

    private setupScheduledSent(client: Client, timePeriod?: number) {
        const DayInMilliseconds = 1000 * 60 * 60 * 24
        client.setInterval(() => {
            const channel = client.channels.cache.get(HChannelId) as TextChannel
            channel.send('每日任务？')
            this.sendR18Img(client)
        }, timePeriod || DayInMilliseconds)
    }
}

export default App
