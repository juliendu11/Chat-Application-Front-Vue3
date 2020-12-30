import { io } from 'socket.io-client'

import SocketError from '@/classes/SocketError'
import DialogManager from '@/classes/DialogManager'

import Room from '@/interfaces/Room'
import Message from '@/interfaces/Message'
import MemberOnline from '@/interfaces/MemberOnline'

import SocketIOEventName from '@/enums/SocketIOEventName'
import SocketIOErrorName from '@/enums/SocketIOErrorName'

import { getToken } from '@/services/token.service'

import { SOCKET_IO_URL } from '@/config'

const SocketManage = (state: any, dialogManager: DialogManager, changeRoom: Function) => {
  const handleSocketIOError = (socketError: SocketError) => {
    dialogManager.showErrorMessage(socketError.Message, socketError.Errorname)
    if (socketError.Errorname === SocketIOErrorName.Unauthorized) {
      changeRoom(state.rooms[0])
    }
  }

  const setSocketIOEventHandler = () => {
    if (!state.socketIOClient) return

    state.socketIOClient.on(SocketIOEventName.MessageRoom, (msg: Message) => {
      state.messages = [...state.messages, msg]
    })
    state.socketIOClient.on(
      SocketIOEventName.OnlineMembers,
      (members: MemberOnline[]) => {
        state.onlineMembers = members
      }
    )
    state.socketIOClient.on(
      SocketIOEventName.UserJoinRoom,
      (member: MemberOnline) => {
        const m = state.onlineMembers.find(
          (x: MemberOnline) => x.username === member.username
        )
        if (m) {
          m.room = member.room
        } else {
          state.onlineMembers = [...state.onlineMembers, member]
        }
      }
    )
    state.socketIOClient.on(
      SocketIOEventName.UserConnected,
      (member: MemberOnline) => {
        state.onlineMembers = [...state.onlineMembers, member]
      }
    )
    state.socketIOClient.on(
      SocketIOEventName.UserDisconnected,
      (member: MemberOnline) => {
        state.onlineMembers = state.onlineMembers.filter(
          (x: MemberOnline) => x.username !== member.username
        )
      }
    )
    state.socketIOClient.on(SocketIOEventName.CreateRoom, (room: Room) => {
      state.rooms = [...state.rooms, room]
    })
    state.socketIOClient.on(SocketIOEventName.Error, (socketError: SocketError) => {
      handleSocketIOError(socketError)
    })
  }

  const createSocketIOClient = () => {
    if (!state.socketIOClient) {
      state.socketIOClient = io(SOCKET_IO_URL, {
        autoConnect: true,
        reconnectionDelay: 2000,
        transportOptions: {
          polling: {
            extraHeaders: {
              Authorization: 'Bearer ' + getToken()
            }
          }
        }
      })
    }
    setSocketIOEventHandler()
    if (state.socketIOClient.disconnected) {
      state.socketIOClient.connect()
    }
  }

  return {
    createSocketIOClient
  }
}

export default SocketManage
