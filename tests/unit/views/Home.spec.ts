import Home from '@/views/Home.vue'

import { mount } from '@vue/test-utils'

jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}))
jest.mock('@/services/api.service', () => ({
  refreshToken: jest.fn()
}))
jest.mock('@/services/token.service', () => ({
  updateToken: jest.fn(),
  clearToken: jest.fn()
}))
jest.mock('@/views/RoomManage', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockReturnValue({
    showDialogChangeRoom: jest.fn(),
    showDialogCreateRoom: jest.fn(),
    acceptChangeRoom: jest.fn(),
    changeRoom: jest.fn(),
    acceptAddRoom: jest.fn(),
    getAllRooms: jest.fn()
  })
}))
jest.mock('@/views/MessageManage', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockReturnValue({
    getMessages: jest.fn().mockResolvedValue({ error: false, message: '', value: [] }),
    messageInfiniteScrolling: jest.fn(),
    sendMessage: jest.fn()
  })
}))
jest.mock('@/views/SocketManage', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockReturnValue({
    createSocketIOClient: jest.fn()
  })
}))

localStorage.setItem('jwt', 'rrr')

describe('Unit test for views/Home.vue', () => {
  it('Should show dialog-container and dialog-backdrop when dialog.show is true', () => {
    const wrapper = mount(Home)
    wrapper.vm.myUsername = 'test'
    wrapper.vm.dialog.show = true

    const dialogBackDrop = wrapper.find('.dialog-backdrop')
    const dialogContainer = wrapper.find('.dialog-container')

    expect(dialogBackDrop.exists()).toBe(true)
    expect(dialogContainer.exists()).toBe(true)
  })
})
