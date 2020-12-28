import { getToken } from './token.service'
const API_URL = 'http://localhost:3000/api'

const login = async (id: string, password: string) => {
  const data = await fetch(API_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
      password
    })
  })

  const { error, message } = await data.json()

  return {
    error,
    message
  }
}

const register = async (username: string, email: string, password: string) => {
  const data = await fetch(API_URL + '/auth/register', {
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

  const { error, message } = await data.json()

  return {
    error,
    message
  }
}

const verify = async (email: string, token: string) => {
  const data = await fetch(API_URL + '/auth/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      token
    })
  })

  const { error, message } = await data.json()

  return {
    error,
    message
  }
}

const forgotPassword = async (email: string) => {
  const data = await fetch(API_URL + '/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email
    })
  })

  const { error, message } = await data.json()

  return {
    error,
    message
  }
}

const resetPassword = async (email: string, token: string, password: string) => {
  const data = await fetch(API_URL + '/auth/reset-password', {
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

  const { error, message } = await data.json()

  return {
    error,
    message
  }
}

const getRooms = async () => {
  const data = await fetch(API_URL + '/room', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + getToken()
    }
  })

  const { error, message, values } = await data.json()
  console.log(values)
  return {
    error,
    message,
    values
  }
}

export {
  login,
  register,
  verify,
  forgotPassword,
  resetPassword,
  getRooms
}
