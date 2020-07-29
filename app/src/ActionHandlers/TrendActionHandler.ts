import ActionHandler from './ActionHandler'
import TrendTagsWorker from '../Workers/TrendTagsWorker'

class TrendActionHandler extends ActionHandler {
  public handle (channelId: string) {
    const trendTagsWorker = new TrendTagsWorker(channelId)
    trendTagsWorker.trendTags(this.client)
  }
}
export default TrendActionHandler
