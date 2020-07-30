import ActionHandler from './ActionHandlers/ActionHandler'

class LastMessageManager {
    lastActionHandler: ActionHandler
    static instance : LastMessageManager;

    public static getInstance () : LastMessageManager {
      if (!this.instance) {
        this.instance = this.createInstance()
      }
      return this.instance
    }

    private static createInstance (): LastMessageManager {
      const lastMessageManager = new LastMessageManager()
      return lastMessageManager
    }

    public setLastActionHandler (actionHandler:ActionHandler) {
      this.lastActionHandler = actionHandler
    }

    public getLastActionHandler () : ActionHandler {
      console.log(this.lastActionHandler)
      return this.lastActionHandler
    }
}
export default LastMessageManager
