import ChangePrivateRoom from '@/components/Dialogs/ChangePrivateRoom.vue'
import { mount } from '@vue/test-utils'

describe('Unit test for components/Dialogs/ChangePrivateRoom.vue', () => {
  it('Should update password value when update corresponding input', async done => {
    const wrapper = mount(ChangePrivateRoom)

    const nameInput = wrapper.find('input[type="password"]')
    await nameInput.setValue('123')

    expect(wrapper.vm.password).toBe('123')
    done()
  })

  it('Shoud call accept with true arg when click on Acced btn', async done => {
    const wrapper = mount(ChangePrivateRoom)
    wrapper.vm.accept = jest.fn()

    const btn = wrapper.find('#changePrivateRoomAccedBtn')
    await btn.trigger('click')

    expect(wrapper.vm.accept).toBeCalled()
    expect(wrapper.vm.accept).toBeCalledWith(true)
    done()
  })

  it('Shoud call accept with false arg when click on Cancel btn', async done => {
    const wrapper = mount(ChangePrivateRoom)
    wrapper.vm.accept = jest.fn()

    const btn = wrapper.find('#changePrivateRoomCancelBtn')
    await btn.trigger('click')

    expect(wrapper.vm.accept).toBeCalled()
    expect(wrapper.vm.accept).toBeCalledWith(false)
    done()
  })

  it('Should emit "accept" witch corresponding value (true) when call accept with true arg', () => {
    const wrapper = mount(ChangePrivateRoom)

    wrapper.vm.password = '123'

    wrapper.vm.accept(true)

    expect(wrapper.emitted()).toHaveProperty('accept')
    expect(wrapper.emitted().accept[0]).toEqual([{
      value: true,
      password: '123'
    }])
  })

  it('Should emit "accept" witch corresponding value (false) when call accept with false arg', () => {
    const wrapper = mount(ChangePrivateRoom)

    wrapper.vm.password = '123'

    wrapper.vm.accept(false)

    expect(wrapper.emitted()).toHaveProperty('accept')
    expect(wrapper.emitted().accept[0]).toEqual([{
      value: false,
      password: '123'
    }])
  })
})
