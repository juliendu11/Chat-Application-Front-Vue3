import DialogManager from '@/classes/DialogManager'
import Pagination from '@/interfaces/Pagination'
import MessageManage from '@/views/MessageManage'
import { getRoomMessages } from '@/services/api.service'
import HomeState from '@/interfaces/State/HomeState'

jest.mock('@/services/api.service', () => ({
  getRoomMessages: jest.fn()
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
  })
})
