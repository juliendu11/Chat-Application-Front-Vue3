/* eslint-disable @typescript-eslint/no-empty-function */
import * as APIService from '@/services/api.service'
import Room from '@/interfaces/Room'

const API_URL = 'http://localhost:3000/'

localStorage.setItem(process.env.VUE_APP_JWT_TOKEN_NAME, 'test')
const getToken = () => localStorage.getItem(process.env.VUE_APP_JWT_TOKEN_NAME)

describe('Unit test for services/api.service.ts', () => {
  describe('For login()', () => {
    it('Should use fetch with correct Uri with correct Option when call login()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: '',
          value: null
        })
      })
      await APIService.login('test', '123')

      const calledUri = `${API_URL}api/auth/login`
      const calledOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: 'test',
          password: '123'
        })
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call login() = {error: false,message: "",value: "123"}', async done => {
      const values = {
        error: false,
        message: '',
        value: '123'
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.login('test', '123')

      expect(result).toEqual(values)
      done()
    })

    it('Should return correct information call login() = {error: true,message: "Hello",value: null}', async done => {
      const values = {
        error: true,
        message: 'Hello',
        value: null
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.login('test', '123')

      expect(result).toEqual(values)
      done()
    })
  })
  describe('For register()', () => {
    it('Should use fetch with correct Uri with correct Option when call register()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: '',
          value: null
        })
      })
      await APIService.register('test', 'test@test.com', '123')

      const calledUri = `${API_URL}api/auth/register`
      const calledOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'test',
          email: 'test@test.com',
          password: '123'
        })
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call register() = {error: false,message: "",value: "123"}', async done => {
      const values = {
        error: false,
        message: '',
        value: '123'
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.register('test', 'test@test.com', '123')

      expect(result).toEqual(values)
      done()
    })

    it('Should return correct information call register() = {error: true,message: "Hello",value: null}', async done => {
      const values = {
        error: true,
        message: 'Hello',
        value: null
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.register('test', 'test@test.com', '123')

      expect(result).toEqual(values)
      done()
    })
  })
  describe('For verify()', () => {
    it('Should use fetch with correct Uri with correct Option when call verify()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: ''
        })
      })
      await APIService.verify('test', '123')

      const calledUri = `${API_URL}api/auth/verify`
      const calledOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test',
          token: '123'
        })
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call verify() = {error: false,message: ""}', async done => {
      const values = {
        error: false,
        message: ''
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.verify('test', '123')

      expect(result).toEqual(values)
      done()
    })

    it('Should return correct information call verify() = {error: true,message: "Hello"}', async done => {
      const values = {
        error: true,
        message: 'Hello'
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.verify('test', '123')

      expect(result).toEqual(values)
      done()
    })
  })
  describe('For forgotPassword()', () => {
    it('Should use fetch with correct Uri with correct Option when call forgotPassword()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: ''
        })
      })
      await APIService.forgotPassword('test@test.com')

      const calledUri = `${API_URL}api/auth/forgot-password`
      const calledOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@test.com'
        })
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call forgotPassword() = {error: false,message: ""}', async done => {
      const values = {
        error: false,
        message: ''
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.forgotPassword('test@test.com')

      expect(result).toEqual(values)
      done()
    })

    it('Should return correct information call forgotPassword() = {error: true,message: "Hello"}', async done => {
      const values = {
        error: true,
        message: 'Hello'
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.forgotPassword('test@test.com')

      expect(result).toEqual(values)
      done()
    })
  })
  describe('For resetPassword()', () => {
    it('Should use fetch with correct Uri with correct Option when call resetPassword()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: ''
        })
      })
      await APIService.resetPassword('test@test.com', '123', '456')

      const calledUri = `${API_URL}api/auth/reset-password`
      const calledOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@test.com',
          token: '123',
          password: '456'
        })
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call resetPassword() = {error: false,message: ""}', async done => {
      const values = {
        error: false,
        message: ''
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.resetPassword('test@test.com', '123', '456')

      expect(result).toEqual(values)
      done()
    })

    it('Should return correct information call resetPassword() = {error: true,message: "Hello"}', async done => {
      const values = {
        error: true,
        message: 'Hello'
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.resetPassword('test@test.com', '123', '456')

      expect(result).toEqual(values)
      done()
    })
  })
  describe('For getRooms()', () => {
    it('Should use fetch with correct Uri with correct Option when call getRooms()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: '',
          values: []
        })
      })
      await APIService.getRooms()

      const calledUri = `${API_URL}api/room`
      const calledOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + getToken()
        }
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call getRooms() = {error: false,message: "", value:[Room, Room]}', async done => {
      const rooms: Room[] = [
        { name: 'test', isPrivate: false, password: '', registeredAt: new Date().toISOString(), messages: [] },
        { name: 'test2', isPrivate: false, password: '', registeredAt: new Date().toISOString(), messages: [] }
      ]
      const values = {
        error: false,
        message: '',
        values: rooms
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.getRooms()

      expect(result).toEqual({
        error: values.error,
        message: values.message,
        value: values.values
      })
      done()
    })

    it('Should return correct information call getRooms() = {error: true,message: "Hello", value: []}', async done => {
      const values = {
        error: true,
        message: 'Hello',
        values: []
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.getRooms()

      expect(result).toEqual({
        error: values.error,
        message: values.message,
        value: []
      })
      done()
    })
  })
  describe('For refreshToken()', () => {
    it('Should use fetch with correct Uri with correct Option when call refreshToken()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: '',
          value: ''
        })
      })
      await APIService.refreshToken()

      const calledUri = `${API_URL}api/auth/token`
      const calledOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + getToken()
        }
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call refreshToken() = {error: false,message: "", value:"123"}', async done => {
      const values = {
        error: false,
        message: '',
        value: '123'
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.refreshToken()

      expect(result).toEqual(values)
      done()
    })

    it('Should return correct information call refreshToken() = {error: true,message: "Hello", value: ""}', async done => {
      const values = {
        error: true,
        message: 'Hello',
        value: ''
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.refreshToken()

      expect(result).toEqual(values)
      done()
    })
  })
  describe('For getRoomMessages()', () => {
    it('Should use fetch with correct Uri with correct Option when call getRoomMessages()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: '',
          values: {}
        })
      })
      await APIService.getRoomMessages('test', 10, 20)

      const calledUri = `${API_URL}api/message/test?skip=10&limit=20`
      const calledOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + getToken()
        }
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call getRoomMessages() = {error: false,message: "", value: {messages:[Message,Message], moreAvailable: true, pageAvailable:2}  }', async done => {
      const values = {
        error: false,
        message: '',
        values: {
          moreAvailable: true,
          pageAvailable: 2,
          messages: [
            {
              text: '123',
              sendAt: new Date().toISOString(),
              owner: 'test11'
            },
            {
              text: '456',
              sendAt: new Date().toISOString(),
              owner: 'test12'
            }
          ]
        }
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.getRoomMessages('test', 10, 20)

      expect(result).toEqual({
        error: values.error,
        message: values.message,
        value: values.values
      })
      done()
    })

    it('Should return correct information call getRoomMessages() = {error: true,message: "Hello", value: null}', async done => {
      const values = {
        error: true,
        message: 'Hello',
        values: null
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.getRooms()

      expect(result).toEqual({
        error: values.error,
        message: values.message,
        value: values.values
      })
      done()
    })
  })
  describe('For createNewRoom()', () => {
    it('Should use fetch with correct Uri with correct Option when call createNewRoom()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: '',
          values: {}
        })
      })
      await APIService.createNewRoom('test', true, '123')

      const calledUri = `${API_URL}api/room`
      const calledOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + getToken()
        },
        body: JSON.stringify({
          roomName: 'test',
          isPrivate: true,
          password: '123'
        })
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call createNewRoom() = {error: false,message: "", value: Room  }', async done => {
      const values = {
        error: false,
        message: '',
        value: {
          name: 'test',
          registeredAt: new Date().toISOString(),
          messages: [],
          isPrivate: false,
          password: '123'
        }
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.createNewRoom('test', true, '123')

      expect(result).toEqual(values)
      done()
    })

    it('Should return correct information call createNewRoom() = {error: true,message: "Hello", value: null}', async done => {
      const values = {
        error: true,
        message: 'Hello',
        value: null
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.createNewRoom('test', true, '123')

      expect(result).toEqual(values)
      done()
    })
  })
  describe('For accedRoom()', () => {
    it('Should use fetch with correct Uri with correct Option when call accedRoom()', async done => {
      window.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          error: false,
          message: '',
          values: {}
        })
      })
      await APIService.accedRoom('test', '123', '5a4ea5e121ae')

      const calledUri = `${API_URL}api/room/test`
      const calledOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + getToken()
        },
        body: JSON.stringify({
          roomName: 'test',
          password: '123',
          socketId: '5a4ea5e121ae'
        })
      }
      expect(window.fetch).toBeCalled()
      expect(window.fetch).toBeCalledWith(calledUri, calledOptions)
      done()
    })

    it('Should return correct information call accedRoom() = {error: false,message: ""  }', async done => {
      const values = {
        error: false,
        message: ''
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.accedRoom('test', '123', '5a4ea5e121ae')

      expect(result).toEqual(values)
      done()
    })

    it('Should return correct information call accedRoom() = {error: true,message: "Hello"}', async done => {
      const values = {
        error: true,
        message: 'Hello'
      }
      window.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue(values) })
      const result = await APIService.accedRoom('test', '123', '5a4ea5e121ae')

      expect(result).toEqual(values)
      done()
    })
  })
})
