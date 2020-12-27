const TOKEN_NAME = 'jwt'

const updateToken = (token: string) => {
  localStorage.setItem(TOKEN_NAME, token)
}

const clearToken = () => {
  localStorage.clear()
}

const getToken = (): string => {
  return localStorage.getItem(TOKEN_NAME) || ''
}

export {
  updateToken,
  clearToken,
  getToken
}
