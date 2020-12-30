import DialogManager from '@/classes/DialogManager'
import * as Vue from 'vue'

describe('Unit test for classes/DialogManager.ts', () => {
  it('Should use globalProperties.$showSwalError when call showErrorMessage because has instance', () => {
    const instance = {
      appContext: {
        config: {
          globalProperties: {
            $showSwalError: jest.fn()
          }
        }
      }
    }
    const e = instance as unknown as Vue.ComponentInternalInstance
    const dialogManagerInstance = new DialogManager(e)
    dialogManagerInstance.showErrorMessage('Hello msg', 'Hello title')

    expect(instance.appContext.config.globalProperties.$showSwalError).toBeCalled()
    expect(instance.appContext.config.globalProperties.$showSwalError).toBeCalledWith('Hello msg', 'Hello title')
  })

  it('Should NOT use globalProperties.$showSwalError when call showErrorMessage because has NOT instance', () => {
    const instance = {
      appContext: {
        config: {
          globalProperties: {
            $showSwalError: jest.fn()
          }
        }
      }
    }
    const dialogManagerInstance = new DialogManager(null)
    dialogManagerInstance.showErrorMessage('Hello msg', 'Hello title')

    expect(instance.appContext.config.globalProperties.$showSwalError).not.toBeCalled()
  })

  it('Should use globalProperties.$showSuccessMessage when call showSuccessMessage because has instance', () => {
    const instance = {
      appContext: {
        config: {
          globalProperties: {
            $showSwalSuccess: jest.fn()
          }
        }
      }
    }
    const e = instance as unknown as Vue.ComponentInternalInstance
    const dialogManagerInstance = new DialogManager(e)
    dialogManagerInstance.showSuccessMessage('Hello msg', 'Hello title')

    expect(instance.appContext.config.globalProperties.$showSwalSuccess).toBeCalled()
    expect(instance.appContext.config.globalProperties.$showSwalSuccess).toBeCalledWith('Hello msg', 'Hello title')
  })

  it('Should NOT use globalProperties.$showSuccessMessage when call showSuccessMessage because has NOT instance', () => {
    const instance = {
      appContext: {
        config: {
          globalProperties: {
            $showSwalSuccess: jest.fn()
          }
        }
      }
    }
    const dialogManagerInstance = new DialogManager(null)
    dialogManagerInstance.showSuccessMessage('Hello msg', 'Hello title')

    expect(instance.appContext.config.globalProperties.$showSwalSuccess).not.toBeCalled()
  })

  it('Should use globalProperties.$showSwalProgress when call showLoadingDialog because has instance', () => {
    const instance = {
      appContext: {
        config: {
          globalProperties: {
            $showSwalProgress: jest.fn()
          }
        }
      }
    }
    const e = instance as unknown as Vue.ComponentInternalInstance
    const dialogManagerInstance = new DialogManager(e)
    dialogManagerInstance.showLoadingDialog('Hello msg', 'Hello title')

    expect(instance.appContext.config.globalProperties.$showSwalProgress).toBeCalled()
    expect(instance.appContext.config.globalProperties.$showSwalProgress).toBeCalledWith('Hello msg', 'Hello title')
  })

  it('Should NOT use globalProperties.$showSwalProgress when call showLoadingDialog because has NOT instance', () => {
    const instance = {
      appContext: {
        config: {
          globalProperties: {
            $showSwalProgress: jest.fn()
          }
        }
      }
    }
    const dialogManagerInstance = new DialogManager(null)
    dialogManagerInstance.showLoadingDialog('Hello msg', 'Hello title')

    expect(instance.appContext.config.globalProperties.$showSwalProgress).not.toBeCalled()
  })

  it('Should use globalProperties.$forceCloseSwal when call forceClose because has instance', () => {
    const instance = {
      appContext: {
        config: {
          globalProperties: {
            $forceCloseSwal: jest.fn()
          }
        }
      }
    }
    const e = instance as unknown as Vue.ComponentInternalInstance
    const dialogManagerInstance = new DialogManager(e)
    dialogManagerInstance.forceClose()

    expect(instance.appContext.config.globalProperties.$forceCloseSwal).toBeCalled()
  })

  it('Should NOT use globalProperties.$forceCloseSwal when call forceClose because has NOT instance', () => {
    const instance = {
      appContext: {
        config: {
          globalProperties: {
            $forceCloseSwal: jest.fn()
          }
        }
      }
    }
    const dialogManagerInstance = new DialogManager(null)
    dialogManagerInstance.forceClose()

    expect(instance.appContext.config.globalProperties.$forceCloseSwal).not.toBeCalled()
  })
})
