/* eslint-disable @typescript-eslint/no-empty-function */
import DialogManager from '@/classes/DialogManager'
import SocketIOEventName from '@/enums/SocketIOEventName'
import Room from '@/interfaces/Room'
import HomeState from '@/interfaces/State/HomeState'

import SocketManage from '@/views/SocketManage'
import { Manager, Socket } from 'socket.io-client'

jest.mock('socket.io-client', () => ({
  Socket: jest.fn(),
  Manager: jest.fn(),
  io: jest.fn().mockReturnValue({
    id: '4545',
    on: jest.fn()
  })
}))

describe('Unit test for Views/SocketManage.ts', () => {
  describe('createSocketIOClient', () => {
    it('Should set state().socketIOClient because is null', () => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const changeRoom = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()

      const { createSocketIOClient } = SocketManage(() => state, dialogManager, changeRoom)

      createSocketIOClient()

      expect(state.socketIOClient).not.toBeNull()
    })

    it('Should set event listener for socketIOClient (SocketIOEventName.MessageRoom, SocketIOEventName.OnlineMembers, SocketIOEventName.UserJoinRoom, SocketIOEventName.UserConnected, SocketIOEventName.UserDisconnected, SocketIOEventName.CreateRoom, SocketIOEventName.Error)', () => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

      const mockOn = jest.fn()

      socketMock.on = mockOn
      socketMock.emit = jest.fn()
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: socketMock,
        messageToSend: ''
      }

      const changeRoom = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()

      const { createSocketIOClient } = SocketManage(() => state, dialogManager, changeRoom)

      createSocketIOClient()

      expect(state.socketIOClient).not.toBeNull()
      expect(state.socketIOClient?.on).toHaveBeenCalledTimes(7)
      expect(mockOn.mock.calls[0][0]).toEqual(SocketIOEventName.MessageRoom)
      expect(mockOn.mock.calls[1][0]).toEqual(SocketIOEventName.OnlineMembers)
      expect(mockOn.mock.calls[2][0]).toEqual(SocketIOEventName.UserJoinRoom)
      expect(mockOn.mock.calls[3][0]).toEqual(SocketIOEventName.UserConnected)
      expect(mockOn.mock.calls[4][0]).toEqual(SocketIOEventName.UserDisconnected)
      expect(mockOn.mock.calls[5][0]).toEqual(SocketIOEventName.CreateRoom)
      expect(mockOn.mock.calls[6][0]).toEqual(SocketIOEventName.Error)
    })

    it('Should use socketIOClient.Connect() because socketIOClient.disconnected is true', () => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

      const mockOn = jest.fn()

      socketMock.on = mockOn
      socketMock.emit = jest.fn()
      socketMock.disconnected = true
      socketMock.connect = jest.fn()

      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: socketMock,
        messageToSend: ''
      }

      const changeRoom = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()

      const { createSocketIOClient } = SocketManage(() => state, dialogManager, changeRoom)

      createSocketIOClient()

      expect(state.socketIOClient?.disconnected).toBe(true)
      expect(state.socketIOClient?.connect).toBeCalled()
    })
  })
})
