import { ComponentInternalInstance } from 'vue'

class DialogManager {
    private Instance: ComponentInternalInstance |null = null;

    constructor (instance: ComponentInternalInstance|null) {
      this.Instance = instance
    }

    public showErrorMessage (msg: string, title = '') {
      if (this.Instance) {
        this.Instance.appContext.config.globalProperties.$showSwalError(
          msg,
          title
        )
      }
    }

    public showSuccessMessage (msg: string, title = '') {
      if (this.Instance) {
        this.Instance.appContext.config.globalProperties.$showSwalSuccess(
          msg,
          title
        )
      }
    }

    public showLoadingDialog (msg: string, title = '') {
      if (this.Instance) {
        this.Instance.appContext.config.globalProperties.$showSwalProgress(
          msg,
          title
        )
      }
    }

    public forceClose () {
      if (this.Instance) {
        this.Instance.appContext.config.globalProperties.$forceCloseSwal()
      }
    }
}

export default DialogManager
