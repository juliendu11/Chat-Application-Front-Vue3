const API_URL = 'http://localhost:3000/api'

const login = async (id: string, password: string) => {
  const processLogin = await fetch(API_URL + '/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      id,
      password
    })
  })

  const { error, message } = await processLogin.json()

  return {
    error,
    message
  }
}

const register = async (username: string, email: string, password: string) => {
  const processLogin = await fetch(API_URL + '/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      username,
      email,
      password
    })
  })

  const { error, message } = await processLogin.json()

  return {
    error,
    message
  }
}

export {
  login,
  register
}
