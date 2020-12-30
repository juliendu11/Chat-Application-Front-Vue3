import DialogManager from '@/classes/DialogManager'

import SocketIOEventName from '@/enums/SocketIOEventName'

import {
  getRoomMessages
} from '@/services/api.service'

const messageManager = (state: Function, pagination: Function, dialogManager: DialogManager, myUsername: string) => {
  const getMessages = async () => {
    if (!state().roomSelected) return
    const { error, message, value } = await getRoomMessages(
      state().roomSelected.name,
      pagination().skip,
      pagination().limit
    )
    if (error) {
      dialogManager.showErrorMessage(message)
      return
    }
    if (value && value.messages && value.messages.length !== 0) {
      state().messages = [...state().messages, ...value.messages]
    }
    pagination().moreAvailable = value.moreAvailable
  }

  const loadMore = async () => {
    pagination().page += 1
    pagination().skip =
      pagination().limit * pagination().page -
      pagination().limit
    await getMessages()
  }

  const messageInfiniteScrolling = async () => {
    const element = document.querySelector('#messagesList')
    if (element && element.scrollTop === 0 && pagination().moreAvailable) {
      try {
        await loadMore()
        element.scroll({
          top: 95 * 4,
          left: 0,
          behavior: 'smooth'
        })
      } catch (error) {
        dialogManager.showErrorMessage(error.message)
      }
    }
  }

  const sendMessage = () => {
    if (!state().socketIOClient) {
      return
    }
    state().socketIOClient.emit(
      SocketIOEventName.MessageRoom,
      state().messageToSend
    )
    const newMsg = {
      text: state().messageToSend,
      sendAt: new Date().toISOString(),
      owner: myUsername
    }
    state().messages = [...state().messages, newMsg]
    state().messageToSend = ''
  }

  return {
    getMessages,
    messageInfiniteScrolling,
    sendMessage
  }
}

export default messageManager
