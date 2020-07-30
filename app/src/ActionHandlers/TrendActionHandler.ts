import ActionHandler from './ActionHandler'
import TrendTagsWorker from '../Workers/TrendTagsWorker'

class TrendActionHandler extends ActionHandler {
  public async handle (channelId: string) {
    const trendTagsWorker = new TrendTagsWorker(channelId)
    await trendTagsWorker.trendTags(this.client)
  }

  public isRecallable () {
    return true
  }
}
export default TrendActionHandler
