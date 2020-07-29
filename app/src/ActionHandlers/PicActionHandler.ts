import ActionHandler from './ActionHandler'
import ImageSearchWorker from '../Workers/ImageSearchWorker'

class PicActionHandler extends ActionHandler {
  public handle (channelId: string) {
    const imageSearchWorker = new ImageSearchWorker(channelId)
    imageSearchWorker.searchImg(this.client)
  }
}
export default PicActionHandler
