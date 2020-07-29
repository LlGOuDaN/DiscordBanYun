import ActionHandler from './ActionHandler'
import SendSoloGifWorker from '../Workers/SendSoloGifWorker'

class SoloGifActionHandler extends ActionHandler {
  public handle (channelId: string) {
    const sendSoloGifWorker = new SendSoloGifWorker(channelId)
    sendSoloGifWorker.sendSoloGif(this.client)
  }
}

export default SoloGifActionHandler
