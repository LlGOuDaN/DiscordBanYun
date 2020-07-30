import ActionHandler from './ActionHandler'
import ImageSearchWorker from '../Workers/ImageSearchWorker'

class PicTagActionHandler extends ActionHandler {
  public async handle (channelId: string) {
    const imageSearchWorker = new ImageSearchWorker(channelId)
    await imageSearchWorker.searchImg(this.client, '', true)
  }

  public isRecallable () {
    return true
  }
}

export default PicTagActionHandler
