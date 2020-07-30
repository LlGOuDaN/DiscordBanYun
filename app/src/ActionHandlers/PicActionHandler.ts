import ActionHandler from './ActionHandler'
import ImageSearchWorker from '../Workers/ImageSearchWorker'

class PicActionHandler extends ActionHandler {
  public handle (channelId: string) {
    const imageSearchWorker = new ImageSearchWorker(channelId)
    imageSearchWorker.searchImg(this.client)
  }

  public isRecallable () {
    return true
  }
}
export default PicActionHandler
