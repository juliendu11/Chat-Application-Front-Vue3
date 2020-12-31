import MessageCard from '@/components/MessageCard.vue'
import { mount } from '@vue/test-utils'
import * as ParseDate from '@/utils/date'

jest.mock('@/utils/date')
const date = new Date().toISOString()

describe('Unit test for components/MessageCard.vue', () => {
  it('Should show span with owner prop, img url end with owner prop, span with text prop and span with parsedDate with date prop (right is false)', () => {
    const a = (ParseDate.formatDateToNow as jest.Mock).mockReturnValue(date)

    const wrapper = mount(MessageCard, {
      props: {
        right: false,
        text: '123',
        owner: 'Test1',
        date
      }
    })

    const cardOwnerContainer = wrapper.find('.message-card-owner-container')
    const cardTextContainer = wrapper.find('.message-card-text-container')

    const cardRightContainer = wrapper.find('.message-card-me')

    const imgOwner = cardOwnerContainer.find('img')
    const spanOwner = cardOwnerContainer.find('span')

    const spanText = cardTextContainer.find('.message-card-text')
    const spanDate = cardTextContainer.findAll('span')[1]

    expect(imgOwner.element.getAttribute('src')?.includes('Test1')).toBe(true)
    expect(spanOwner.text()).toBe('Test1')

    expect(spanText.text()).toBe('123')
    expect(spanDate.text()).toBe(date)

    expect(cardRightContainer.exists()).toBe(false)
  })

  it('Should show .message-card-me class when right is true', () => {
    const wrapper = mount(MessageCard, {
      props: {
        right: true,
        text: '123',
        owner: 'Test1',
        date
      }
    })

    const cardRightContainer = wrapper.find('.message-card-me')

    expect(cardRightContainer.exists()).toBe(true)
  })

  it('Should show span with owner prop, img url end with owner prop, span with text prop and span with parsedDate with date prop (right is true)', () => {
    const a = (ParseDate.formatDateToNow as jest.Mock).mockReturnValue(date)

    const wrapper = mount(MessageCard, {
      props: {
        right: true,
        text: '123',
        owner: 'Test1',
        date
      }
    })

    const cardOwnerContainer = wrapper.find('.message-card-owner-container')
    const cardTextContainer = wrapper.find('.message-card-text-container')

    const cardRightContainer = wrapper.find('.message-card-me')

    const imgOwner = cardOwnerContainer.find('img')
    const spanOwner = cardOwnerContainer.find('span')

    const spanText = cardTextContainer.find('.message-card-text')
    const spanDate = cardTextContainer.findAll('span')[1]

    expect(imgOwner.element.getAttribute('src')?.includes('Test1')).toBe(true)
    expect(spanOwner.text()).toBe('Test1')

    expect(spanText.text()).toBe('123')
    expect(spanDate.text()).toBe(date)

    expect(cardRightContainer.exists()).toBe(true)
  })
})
