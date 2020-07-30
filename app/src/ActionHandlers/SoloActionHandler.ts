import ActionHandler from './ActionHandler'
import SendSoloWorker from '../Workers/SendSoloWorker'

class SoloActionHandler extends ActionHandler {
  public async handle (channelId: string) {
    const sendSoloWorker = new SendSoloWorker(channelId)
    await sendSoloWorker.sendSolo(this.client)
  }

  public isRecallable () {
    return true
  }
}

export default SoloActionHandler
