import ChangePrivateRoomResult from '@/interfaces/DialogResult/ChangePrivateRoom'
import AddRoomResult from '@/interfaces/DialogResult/AddRoom'
import Room from '@/interfaces/Room'

import {
  accedRoom,
  getRooms,
  createNewRoom
} from '@/services/api.service'

import DialogManager from '@/classes/DialogManager'

import SocketIOEventName from '@/enums/SocketIOEventName'

const RoomManage = (state: Function, dialog: Function, getMessages: Function, dialogManager: DialogManager) => {
  const changeRoom = async (room: Room) => {
    if (!state().socketIOClient) {
      return
    }
    state().messages = []
    state().roomSelected = room
    await getMessages()

    state().socketIOClient.emit(
      SocketIOEventName.ChangeRoom,
      state().roomSelected.name
    )
  }

  const acceptChangeRoom = async ({
    value,
    password
  }: ChangePrivateRoomResult) => {
    dialog().show = false
    if (value && state().socketIOClient && state().pendingRoomSelected) {
      const processAccedRoom = await accedRoom(state().pendingRoomSelected.name, password, state().socketIOClient.id)
      if (processAccedRoom.error) {
        dialogManager.showErrorMessage(processAccedRoom.message)
        return
      }

      changeRoom(state().pendingRoomSelected)
    }
  }

  const showDialogChangeRoom = (room: Room) => {
    if (room.isPrivate) {
      state().pendingRoomSelected = room
      dialog().show = true
      dialog().isAddRoom = false
      dialog().isChangePrivateRoom = true
      return
    }
    changeRoom(room)
  }

  const showDialogCreateRoom = () => {
    dialog().show = true
    dialog().isAddRoom = true
    dialog().isChangePrivateRoom = false
  }

  const acceptAddRoom = async ({
    value,
    name,
    isPrivate,
    password
  }: AddRoomResult) => {
    dialog().show = false

    if (value && state().socketIOClient) {
      const processAddNewRoom = await createNewRoom(
        name,
        isPrivate,
        password
      )
      if (processAddNewRoom.error) {
        dialogManager.showErrorMessage(processAddNewRoom.message)
        return
      }

      state().socketIOClient.emit(SocketIOEventName.CreateRoom, processAddNewRoom.value)
    }
  }

  const getAllRooms = async () => {
    try {
      const { error, message, value } = await getRooms()
      if (error) {
        dialogManager.showErrorMessage(message)
        return
      }
      state().rooms = value
    } catch (error) {
      dialogManager.showErrorMessage(error.message)
    }
  }

  return {
    changeRoom,
    showDialogCreateRoom,
    showDialogChangeRoom,
    acceptChangeRoom,
    acceptAddRoom,
    getAllRooms
  }
}

export default RoomManage
