import AddRoom from '@/components/Dialogs/AddRoom.vue'
import { mount } from '@vue/test-utils'

describe('Unit test for components/Dialogs/AddRoom.vue', () => {
  it('Should update name value when update corresponding input', async done => {
    const wrapper = mount(AddRoom)

    const nameInput = wrapper.find('input[type="text"]')
    await nameInput.setValue('test')

    expect(wrapper.vm.name).toBe('test')
    done()
  })

  it('Should update password value when update corresponding input', async done => {
    const wrapper = mount(AddRoom)

    const passwordInput = wrapper.find('input[type="password"]')
    await passwordInput.setValue('123')

    expect(wrapper.vm.password).toBe('123')
    done()
  })

  it('Should update isPrivate false to true value when update corresponding input', async done => {
    const wrapper = mount(AddRoom)

    const isPrivateInput = wrapper.find('input[type="checkbox"]')
    await isPrivateInput.setValue(true)

    expect(wrapper.vm.isPrivate).toBe(true)
    done()
  })

  it('Should update isPrivate true to false value when update corresponding input', async done => {
    const wrapper = mount(AddRoom)

    const isPrivateInput = wrapper.find('input[type="checkbox"]')
    await isPrivateInput.setValue(true)

    expect(wrapper.vm.isPrivate).toBe(true)

    await isPrivateInput.setValue(false)

    expect(wrapper.vm.isPrivate).toBe(false)
    done()
  })

  it('Shoud call accept with true arg when click on Add btn', async done => {
    const wrapper = mount(AddRoom)
    wrapper.vm.accept = jest.fn()

    const btn = wrapper.find('#addRoomAddBtn')
    await btn.trigger('click')

    expect(wrapper.vm.accept).toBeCalled()
    expect(wrapper.vm.accept).toBeCalledWith(true)
    done()
  })

  it('Shoud call accept with false arg when click on Cancel btn', async done => {
    const wrapper = mount(AddRoom)
    wrapper.vm.accept = jest.fn()

    const btn = wrapper.find('#addRoomCancelBtn')
    await btn.trigger('click')

    expect(wrapper.vm.accept).toBeCalled()
    expect(wrapper.vm.accept).toBeCalledWith(false)
    done()
  })

  it('Should emit "accept" witch corresponding value (true) when call accept with true arg', () => {
    const wrapper = mount(AddRoom)

    wrapper.vm.name = 'test'
    wrapper.vm.isPrivate = true
    wrapper.vm.password = '123'

    wrapper.vm.accept(true)

    expect(wrapper.emitted()).toHaveProperty('accept')
    expect(wrapper.emitted().accept[0]).toEqual([{
      value: true,
      name: 'test',
      isPrivate: true,
      password: '123'
    }])
  })

  it('Should emit "accept" witch corresponding value (false) when call accept with false arg', () => {
    const wrapper = mount(AddRoom)

    wrapper.vm.name = 'test'
    wrapper.vm.isPrivate = true
    wrapper.vm.password = '123'

    wrapper.vm.accept(false)

    expect(wrapper.emitted()).toHaveProperty('accept')
    expect(wrapper.emitted().accept[0]).toEqual([{
      value: false,
      name: 'test',
      isPrivate: true,
      password: '123'
    }])
  })
})
