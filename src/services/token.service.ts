import { JWT_TOKEN_NAME } from '@/config'

const updateToken = (token: string) => {
  localStorage.setItem(JWT_TOKEN_NAME, token)
}

const clearToken = () => {
  localStorage.removeItem(JWT_TOKEN_NAME)
}

const getToken = (): string => {
  return localStorage.getItem(JWT_TOKEN_NAME) || ''
}

export {
  updateToken,
  clearToken,
  getToken
}
