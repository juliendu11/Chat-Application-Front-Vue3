import * as TokenService from '@/services/token.service'

describe('Unit test for services/token.service.ts', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('Should set "azzrezr" in localStorage with key "jwt" when call updateToken', () => {
    const token = 'azzrezr'
    TokenService.updateToken(token)

    expect(localStorage.getItem('jwt')).toBe(token)
  })

  it('Should delete "azzrezr" in localStorage with key "jwt" when call clearToken', () => {
    const token = 'azzrezr'
    TokenService.updateToken(token)

    expect(localStorage.getItem('jwt')).toBe(token)

    TokenService.clearToken()

    expect(localStorage.getItem('jwt')).toBe(null)
  })

  it('Should delete "azzrezr" in localStorage with key "jwt" when call clearToken but not "5555" with key "test"', () => {
    const token = 'azzrezr'
    const token2 = '5555'

    // SET
    localStorage.setItem('jwt', token)
    localStorage.setItem('test', token2)

    // VERIFY EXIST AFTER SET AND BEFORE CLEAR
    expect(localStorage.getItem('jwt')).toBe(token)
    expect(localStorage.getItem('test')).toBe(token2)

    TokenService.clearToken()

    // VERIFY EXIST AFTER CLEAR
    expect(localStorage.getItem('jwt')).toBe(null)
    expect(localStorage.getItem('test')).toBe(token2)
  })

  it('Should return nothing when call getToken because not token set', () => {
    const token = 'azzrezr'
    expect(TokenService.getToken()).toBe('')
  })

  it('Should return "azzrezr" when call getToken because token set', () => {
    const token = 'azzrezr'
    TokenService.updateToken(token)
    expect(TokenService.getToken()).toBe(token)
  })
})
