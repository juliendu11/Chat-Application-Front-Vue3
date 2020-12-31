import DialogManager from '@/classes/DialogManager'
import SocketIOEventName from '@/enums/SocketIOEventName'
import Dialog from '@/interfaces/Dialog'
import Room from '@/interfaces/Room'
import HomeState from '@/interfaces/State/HomeState'
import RoomManage from '@/views/RoomManage'
import { Manager, Socket } from 'socket.io-client'
import * as APIService from '@/services/api.service'

jest.mock('socket.io-client', () => ({
  Socket: jest.fn(),
  Manager: jest.fn()
}))

jest.mock('@/services/api.service')

describe('Unit test for Views/RoomManage.ts', () => {
  describe('changeRoom', () => {
    it('Should not use getMessages() because state().socketIOClient is null and change room', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: false,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { changeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      const roomSelected: Room = {
        name: 'Test',
        registeredAt: new Date().toISOString(),
        messages: [],
        isPrivate: false,
        password: ''
      }

      await changeRoom(roomSelected)

      expect(getMessages).not.toBeCalled()
      done()
    })

    it('Should clear state().messages to empty array because state().socketIOClient is not null and change room', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

      socketMock.emit = jest.fn()
      const state: HomeState = {
        roomSelected: null,
        messages: [{
          text: 'test',
          sendAt: new Date().toISOString(),
          owner: 'test11'
        }],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: socketMock,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: false,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { changeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      const roomSelected: Room = {
        name: 'Test',
        registeredAt: new Date().toISOString(),
        messages: [],
        isPrivate: false,
        password: ''
      }

      expect(state.messages.length).toBe(1)

      await changeRoom(roomSelected)

      expect(state.messages.length).toBe(0)
      done()
    })

    it('Should set state().roomSelected to room passed in arg because state().socketIOClient is not null and change room', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: false,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { changeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      const roomSelected: Room = {
        name: 'Test',
        registeredAt: new Date().toISOString(),
        messages: [],
        isPrivate: false,
        password: ''
      }

      await changeRoom(roomSelected)

      expect(state.roomSelected).toEqual(roomSelected)
      done()
    })

    it('Should use getMessages() because state().socketIOClient is not null and change room', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: false,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { changeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      const roomSelected: Room = {
        name: 'Test',
        registeredAt: new Date().toISOString(),
        messages: [],
        isPrivate: false,
        password: ''
      }

      await changeRoom(roomSelected)

      expect(getMessages).toBeCalled()
      done()
    })

    it('Should use state().socketIOClient.emit() with correct arg (ChangeRoom Event name and Room name passed in arg) because state().socketIOClient is not null and change room', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: false,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { changeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      const roomSelected: Room = {
        name: 'Test',
        registeredAt: new Date().toISOString(),
        messages: [],
        isPrivate: false,
        password: ''
      }

      await changeRoom(roomSelected)

      expect(state.socketIOClient?.emit).toBeCalled()
      expect(state.socketIOClient?.emit).toBeCalledWith(SocketIOEventName.ChangeRoom, roomSelected.name)
      done()
    })
  })

  describe('showDialogCreateRoom', () => {
    it('Should set dialog().show to true and dialog().isAddRoom to true and dialog().isChangePrivateRoom to false', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: false,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { showDialogCreateRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await showDialogCreateRoom()

      expect(dialog.show).toBe(true)
      expect(dialog.isAddRoom).toBe(true)
      expect(dialog.isChangePrivateRoom).toBe(false)
      done()
    })
  })

  describe('showDialogChangeRoom', () => {
    it('Should not update state().pendingRoomSelected and dialog().show and dialog().isAddRoom and dialog().isChangePrivateRoom because room passed in arg is not private, use changeRoom() then getMessages() directly', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: false,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const a = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      const roomSelected: Room = {
        name: 'Test',
        registeredAt: new Date().toISOString(),
        messages: [],
        isPrivate: false,
        password: ''
      }

      await a.showDialogChangeRoom(roomSelected)

      expect(dialog.show).toBe(false)
      expect(dialog.isAddRoom).toBe(false)
      expect(dialog.isChangePrivateRoom).toBe(false)
      expect(getMessages).toHaveBeenCalled()
      done()
    })

    it('Should update state().pendingRoomSelected and dialog().show and dialog().isAddRoom and dialog().isChangePrivateRoom because room passed in arg is private, not use changeRoom() then getMessages()', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: false,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const a = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      const roomSelected: Room = {
        name: 'Test',
        registeredAt: new Date().toISOString(),
        messages: [],
        isPrivate: true,
        password: ''
      }

      await a.showDialogChangeRoom(roomSelected)

      expect(dialog.show).toBe(true)
      expect(dialog.isAddRoom).toBe(false)
      expect(dialog.isChangePrivateRoom).toBe(true)
      expect(getMessages).not.toHaveBeenCalled()
      done()
    })
  })
  describe('acceptChangeRoom', () => {
    it('Should set dialog().show true to false', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptChangeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptChangeRoom({ value: false, password: '' })

      expect(dialog.show).toBe(false)
      done()
    })

    it('Should not use accedRoom() because value is false, state().socketIOClient is null and state().pendingRoomSelected is null', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptChangeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptChangeRoom({ value: false, password: '' })

      expect(APIService.accedRoom).not.toBeCalled()
      done()
    })

    it('Should not use accedRoom() because value is true, state().socketIOClient is null and state().pendingRoomSelected is null', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptChangeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptChangeRoom({ value: true, password: '' })

      expect(APIService.accedRoom).not.toBeCalled()
      done()
    })

    it('Should not use accedRoom() because value is true, state().socketIOClient is not null and state().pendingRoomSelected is null', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptChangeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptChangeRoom({ value: true, password: '' })

      expect(APIService.accedRoom).not.toBeCalled()
      done()
    })

    it('Should use accedRoom() because value is true, state().socketIOClient is not null and state().pendingRoomSelected is not null', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

      socketMock.emit = jest.fn()
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: { name: 'test1', isPrivate: true, password: '123', registeredAt: new Date().toISOString(), messages: [] },
        socketIOClient: socketMock,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const a = (APIService.accedRoom as jest.Mock).mockResolvedValue({
        error: false,
        message: ''
      })

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptChangeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptChangeRoom({ value: true, password: '' })

      expect(APIService.accedRoom).toBeCalled()
      done()
    })

    it('Should use getMessages() because accedRoom() return error false', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

      socketMock.emit = jest.fn()
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: { name: 'test1', isPrivate: true, password: '123', registeredAt: new Date().toISOString(), messages: [] },
        socketIOClient: socketMock,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const a = (APIService.accedRoom as jest.Mock).mockResolvedValue({
        error: false,
        message: ''
      })

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptChangeRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptChangeRoom({ value: true, password: '' })

      expect(getMessages).toBeCalled()
      done()
    })
  })
  describe('acceptAddRoom', () => {
    it('Should set dialog().show true to false and not use createNewRoom() because return value is false and  state().socketIOClient is null', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptAddRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptAddRoom({ value: false, isPrivate: false, name: '', password: '' })

      expect(dialog.show).toBe(false)
      expect(APIService.createNewRoom).not.toBeCalled()
      done()
    })

    it('Should set dialog().show true to false and not use createNewRoom() because return value is true and state().socketIOClient is null', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptAddRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptAddRoom({ value: true, isPrivate: false, name: 'Test1', password: '' })

      expect(dialog.show).toBe(false)
      expect(APIService.createNewRoom).not.toBeCalled()
      done()
    })

    it('Should set dialog().show true to false and use createNewRoom() because return value is true and state().socketIOClient is not null', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const a = (APIService.createNewRoom as jest.Mock).mockResolvedValue({
        error: true,
        message: '',
        value: ''
      })

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptAddRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptAddRoom({ value: true, isPrivate: false, name: 'Test1', password: '' })

      expect(dialog.show).toBe(false)
      expect(APIService.createNewRoom).toBeCalled()
      done()
    })

    it('Should use createNewRoom() with correct arg', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const a = (APIService.createNewRoom as jest.Mock).mockResolvedValue({
        error: true,
        message: '',
        value: ''
      })

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptAddRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptAddRoom({ value: true, isPrivate: false, name: 'Test1', password: '' })

      expect(APIService.createNewRoom).toBeCalled()
      expect(APIService.createNewRoom).toBeCalledWith('Test1', false, '')
      done()
    })

    it('Should use dialogManager.showErrorMessage() with error message because createNewRoom return error true', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const a = (APIService.createNewRoom as jest.Mock).mockResolvedValue({
        error: true,
        message: 'Hello',
        value: ''
      })

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()

      const { acceptAddRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptAddRoom({ value: true, isPrivate: false, name: 'Test1', password: '' })

      expect(APIService.createNewRoom).toBeCalled()
      expect(dialogManager.showErrorMessage).toBeCalledWith('Hello')
      done()
    })

    it('Should use state().socketIOClient.emit with SocketIOEventName.CreateRoom and Room received by createNewRoom.value because createNewRoom return error false', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

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

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const newRoom: Room = {
        name: 'Test1',
        registeredAt: new Date().toISOString(),
        messages: [],
        isPrivate: false,
        password: ''
      }

      const a = (APIService.createNewRoom as jest.Mock).mockResolvedValue({
        error: false,
        message: 'Hello',
        value: newRoom
      })

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)

      const { acceptAddRoom } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await acceptAddRoom({ value: true, isPrivate: false, name: 'Test1', password: '' })

      expect(state.socketIOClient?.emit).toBeCalled()
      expect(state.socketIOClient?.emit).toBeCalledWith(SocketIOEventName.CreateRoom, newRoom)
      done()
    })
  })
  describe('getAllRooms', () => {
    it('Should use dialogManager.showErrorMessage with error message because getRooms() return error true', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const a = (APIService.getRooms as jest.Mock).mockResolvedValue({
        error: true,
        message: 'Hello',
        value: null
      })

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()

      const { getAllRooms } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await getAllRooms()

      expect(dialogManager.showErrorMessage).toBeCalled()
      expect(dialogManager.showErrorMessage).toBeCalledWith('Hello')
      done()
    })

    it('Should set state().rooms with 2 rooms received in getRooms().value because getRooms() return error false', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const dialog: Dialog = {
        show: true,
        isAddRoom: false,
        isChangePrivateRoom: false
      }

      const rooms: Room[] = [
        {
          name: 'Test1',
          registeredAt: new Date().toISOString(),
          messages: [],
          isPrivate: false,
          password: ''
        },
        {
          name: 'Test2',
          registeredAt: new Date().toISOString(),
          messages: [],
          isPrivate: false,
          password: ''
        }
      ]

      const a = (APIService.getRooms as jest.Mock).mockResolvedValue({
        error: false,
        message: '',
        value: rooms
      })

      const getMessages = jest.fn()
      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()

      const { getAllRooms } = RoomManage(() => state, () => dialog, getMessages, dialogManager)

      await getAllRooms()

      expect(dialogManager.showErrorMessage).not.toBeCalled()
      expect(state.rooms.length).toBe(2)
      done()
    })
  })
})
