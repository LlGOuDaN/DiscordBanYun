import ActionHandler from './ActionHandler'
import SendSoloWorker from '../Workers/SendSoloWorker'

class SoloActionHandler extends ActionHandler {
  public handle (channelId: string) {
    const sendSoloWorker = new SendSoloWorker(channelId)
    sendSoloWorker.sendSolo(this.client)
  }
}

export default SoloActionHandler
