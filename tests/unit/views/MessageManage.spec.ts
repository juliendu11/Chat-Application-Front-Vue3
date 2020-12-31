import DialogManager from '@/classes/DialogManager'
import Pagination from '@/interfaces/Pagination'
import MessageManage from '@/views/MessageManage'
import { getRoomMessages } from '@/services/api.service'
import HomeState from '@/interfaces/State/HomeState'
import Message from '@/interfaces/Message'
import SocketIOEventName from '@/enums/SocketIOEventName'
import { Socket, Manager } from 'socket.io-client'

jest.mock('@/services/api.service', () => ({
  getRoomMessages: jest.fn()
}))

jest.mock('socket.io-client', () => ({
  Socket: jest.fn(),
  Manager: jest.fn()
}))

describe('Unit test for Views/MessageManage.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getMessages', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('Should not use getRoomMessages because state.roomSelected is null', async done => {
      const state: HomeState = {
        roomSelected: null,
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''

      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 0,
        skip: 0
      }

      const dialogManager: DialogManager = new DialogManager(null)
      const myUsername = 'Test1'

      const { getMessages } = MessageManage(() => state, () => pagination, dialogManager, myUsername)

      await getMessages()

      expect(getRoomMessages).not.toBeCalled()
      done()
    })

    it('Should use getRoomMessages with corresponding data (state and pagination) because state.roomSelected is not null', async done => {
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 0,
        skip: 0
      }

      const a = (getRoomMessages as jest.Mock).mockResolvedValue({
        error: false,
        message: '',
        value: {
          messages: []
        }
      })

      const dialogManager: DialogManager = new DialogManager(null)
      const myUsername = 'Test1'

      const { getMessages } = MessageManage(() => state, () => pagination, dialogManager, myUsername)

      await getMessages()

      const roomName = state.roomSelected?.name || ''

      expect(getRoomMessages).toBeCalled()
      expect(getRoomMessages).toBeCalledWith(roomName, pagination.skip, pagination.limit)

      done()
    })

    it('Should use dialogManager.showErrorMessage with message when call getRoomMessages because return error true', async done => {
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 0,
        skip: 0
      }

      const a = (getRoomMessages as jest.Mock).mockResolvedValue({
        error: true,
        message: 'Hello',
        value: {
          messages: []
        }
      })

      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()
      const myUsername = 'Test1'

      const { getMessages } = MessageManage(() => state, () => pagination, dialogManager, myUsername)

      await getMessages()

      expect(dialogManager.showErrorMessage).toBeCalled()
      expect(dialogManager.showErrorMessage).toBeCalledWith('Hello')

      done()
    })

    it('Should add messages in state.messages when call getRoomMessages because return error false and value.messages with 2 item', async done => {
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 0,
        skip: 0
      }

      const messages: Message[] = [
        { text: '123', sendAt: new Date().toISOString(), owner: 'test@test.com' },
        { text: '456', sendAt: new Date().toISOString(), owner: 'test@test.com' }
      ]

      const a = (getRoomMessages as jest.Mock).mockResolvedValue({
        error: false,
        message: '',
        value: {
          messages: messages
        }
      })

      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()
      const myUsername = 'Test1'

      const { getMessages } = MessageManage(() => state, () => pagination, dialogManager, myUsername)

      await getMessages()

      expect(state.messages.length).toBe(2)
      expect(state.messages[0].text).toBe('123')
      expect(state.messages[1].text).toBe('456')

      done()
    })

    it('Should set pagination.moreAvailable to true when call getRoomMessages because return error false and moreAvailable is true', async done => {
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 0,
        skip: 0
      }

      const a = (getRoomMessages as jest.Mock).mockResolvedValue({
        error: false,
        message: '',
        value: {
          moreAvailable: true
        }
      })

      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()
      const myUsername = 'Test1'

      const { getMessages } = MessageManage(() => state, () => pagination, dialogManager, myUsername)

      await getMessages()

      expect(pagination.moreAvailable).toBe(true)

      done()
    })
  })

  describe('messageInfiniteScrolling', () => {
    it('Should use getRoomMessages() and loadMore() when call messageInfiniteScrolling() because element && element.scrollTop === 0 && pagination().moreAvailable', async done => {
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 10,
        skip: 0
      }

      const a = (getRoomMessages as jest.Mock).mockResolvedValue({
        error: false,
        message: '',
        value: {
          moreAvailable: true
        }
      })

      document.querySelector = jest
        .fn()
        .mockReturnValue({
          scrollTop: 0,
          scroll: jest.fn()
        })

      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()

      const messageManage = MessageManage(() => state, () => pagination, dialogManager, 'Test1')

      await messageManage.messageInfiniteScrolling()

      expect(document.querySelector).toBeCalled()
      expect(document.querySelector).toBeCalledWith('#messagesList')

      expect(dialogManager.showErrorMessage).not.toBeCalled()

      expect(getRoomMessages).toBeCalled()
      expect(pagination).toEqual({
        page: 2,
        moreAvailable: true,
        limit: 10,
        skip: 10 * 2 - 10
      })
      done()
    })

    it('Should not use getMessages() and loadMore() when call messageInfiniteScrolling() because !element', async done => {
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 10,
        skip: 0
      }

      const a = (getRoomMessages as jest.Mock).mockResolvedValue({
        error: false,
        message: '',
        value: {
          moreAvailable: true
        }
      })

      document.querySelector = jest
        .fn()

      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()

      const messageManage = MessageManage(() => state, () => pagination, dialogManager, 'Test1')
      messageManage.getMessages = jest.fn()

      await messageManage.messageInfiniteScrolling()

      expect(document.querySelector).toBeCalled()
      expect(document.querySelector).toBeCalledWith('#messagesList')

      expect(dialogManager.showErrorMessage).not.toBeCalled()

      expect(messageManage.getMessages).not.toBeCalled()
      expect(pagination).toEqual({
        page: 1,
        moreAvailable: true,
        limit: 10,
        skip: 0
      })
      done()
    })

    it('Should use showErrorMessage() when call messageInfiniteScrolling() because getRoomMessages() return exception', async done => {
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 10,
        skip: 0
      }

      const a = (getRoomMessages as jest.Mock).mockRejectedValue(new Error('test'))

      document.querySelector = jest
        .fn()
        .mockReturnValue({
          scrollTop: 0,
          scroll: jest.fn()
        })

      const dialogManager: DialogManager = new DialogManager(null)
      dialogManager.showErrorMessage = jest.fn()

      const messageManage = MessageManage(() => state, () => pagination, dialogManager, 'Test1')

      await messageManage.messageInfiniteScrolling()

      expect(document.querySelector).toBeCalled()
      expect(document.querySelector).toBeCalledWith('#messagesList')

      expect(dialogManager.showErrorMessage).toBeCalled()
      expect(dialogManager.showErrorMessage).toBeCalledWith('test')

      done()
    })
  })

  describe('sendMessage', () => {
    it('Should be not add message in state().messages because state().socketIOClient.emit equal null', async done => {
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: null,
        messageToSend: ''
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 10,
        skip: 0
      }

      const dialogManager: DialogManager = new DialogManager(null)
      const messageManage = MessageManage(() => state, () => pagination, dialogManager, 'Test1')
      await messageManage.sendMessage()

      expect(state.messages.length).toBe(0)
      done()
    })

    it('Should be use state().socketIOClient.emit with correct arg because state().socketIOClient not equal null', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

      socketMock.emit = jest.fn()
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: socketMock,
        messageToSend: 'Hello'
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 10,
        skip: 0
      }

      const dialogManager: DialogManager = new DialogManager(null)
      const messageManage = MessageManage(() => state, () => pagination, dialogManager, 'Test1')
      await messageManage.sendMessage()

      expect(socketMock.emit).toBeCalled()
      expect(socketMock.emit).toBeCalledWith(SocketIOEventName.MessageRoom, 'Hello')
      done()
    })

    it('Should be add new message in state().messages with correct information because state().socketIOClient not equal null', async done => {
      const io = new Manager()
      const socketMock = new Socket(io, '')

      socketMock.emit = jest.fn()
      const state: HomeState = {
        roomSelected: { name: 'MyRoom', registeredAt: new Date().toISOString(), messages: [], isPrivate: false, password: '' },
        messages: [],
        rooms: [],
        onlineMembers: [],
        pendingRoomSelected: null,
        socketIOClient: socketMock,
        messageToSend: 'Hello'
      }

      const pagination: Pagination = {
        page: 1,
        moreAvailable: true,
        limit: 10,
        skip: 0
      }

      const dialogManager: DialogManager = new DialogManager(null)
      const messageManage = MessageManage(() => state, () => pagination, dialogManager, 'Test1')
      await messageManage.sendMessage()

      expect(state.messages.length).toBe(1)
      expect(state.messages[0].text).toEqual('Hello')
      expect(state.messages[0].owner).toEqual('Test1')
      done()
    })
  })
})
