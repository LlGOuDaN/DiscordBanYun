import ActionHandler from './ActionHandler'
import ImageSearchWorker from '../Workers/ImageSearchWorker'

class PicActionHandler extends ActionHandler {
  public async handle (channelId: string) {
    const imageSearchWorker = new ImageSearchWorker(channelId)
    await imageSearchWorker.searchImg(this.client)
  }

  public isRecallable () {
    return true
  }
}
export default PicActionHandler
