import { getCurrentInstance } from 'vue'
import { getToken } from './token.service'
import { API_URL } from '@/config'
import APIResponse from '@/interfaces/APIResponse'
import APIResponseWithValue from '@/interfaces/APIResponseWithValue'
import Room from '@/interfaces/Room'
import GetRoomMessages from '@/interfaces/APIResponsesEntity/GetRoomMessages'

const requestHandler = async (url: string, options: RequestInit|undefined) => {
  const vueInstance = getCurrentInstance()

  const data = await fetch(url, options)

  const result = await data.json()
  if (result.error && result.message === 'jwt expired') {
    if (vueInstance) {
      vueInstance.appContext.config.globalProperties.$forceLogout()
    }
  }
  return result
}

const login = async (id: string, password: string): Promise<APIResponseWithValue<string>> => {
  const { error, message, value } = await requestHandler(API_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
      password
    })
  })

  return {
    error,
    message,
    value
  }
}

const register = async (username: string, email: string, password: string): Promise<APIResponseWithValue<string>> => {
  const { error, message, value } = await requestHandler(API_URL + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email,
      password
    })
  })

  return {
    error,
    message,
    value
  }
}

const verify = async (email: string, token: string): Promise<APIResponse> => {
  const { error, message } = await requestHandler(API_URL + '/auth/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      token
    })
  })

  return {
    error,
    message
  }
}

const forgotPassword = async (email: string): Promise<APIResponse> => {
  const { error, message } = await requestHandler(API_URL + '/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email
    })
  })

  return {
    error,
    message
  }
}

const resetPassword = async (email: string, token: string, password: string): Promise<APIResponse> => {
  const { error, message } = await requestHandler(API_URL + '/auth/reset-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      token,
      password
    })
  })

  return {
    error,
    message
  }
}

const getRooms = async (): Promise<APIResponseWithValue<Room[]>> => {
  const { error, message, values } = await requestHandler(API_URL + '/room', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + getToken()
    }
  })

  return {
    error,
    message,
    value: values
  }
}

const refreshToken = async (): Promise<APIResponseWithValue<string>> => {
  const { error, message, value } = await requestHandler(API_URL + '/auth/token', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + getToken()
    }
  })

  return {
    error,
    message,
    value
  }
}

const getRoomMessages = async (roomName: string, skip: number, limit: number): Promise<APIResponseWithValue<GetRoomMessages>> => {
  const { error, message, values } = await requestHandler(`${API_URL}/message/${roomName}?skip=${skip}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + getToken()
    }
  })

  return {
    error,
    message,
    value: values
  }
}

const createNewRoom = async (roomName: string, isPrivate: boolean, password: string): Promise<APIResponseWithValue<Room>> => {
  const { error, message, value } = await requestHandler(API_URL + '/room', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + getToken()
    },
    body: JSON.stringify({
      roomName,
      isPrivate,
      password
    })
  })

  return {
    error,
    message,
    value
  }
}

const accedRoom = async (roomName: string, password: string, socketId: string): Promise<APIResponse> => {
  const { error, message } = await requestHandler(API_URL + '/room/' + roomName, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + getToken()
    },
    body: JSON.stringify({
      roomName,
      password,
      socketId
    })
  })

  return {
    error,
    message
  }
}

export {
  login,
  register,
  verify,
  forgotPassword,
  resetPassword,
  getRooms,
  refreshToken,
  getRoomMessages,
  createNewRoom,
  accedRoom
}
