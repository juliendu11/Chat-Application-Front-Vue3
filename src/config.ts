import { parseEnvToNumber } from './helpers/envParser'

const API_URL = process.env.VUE_APP_API_URL

const REFRESH_JWT_TIME: number = parseEnvToNumber(process.env.VUE_APP_JWT_EXPIRE_IN_MINUTES, 10) - 1

const JWT_TOKEN_NAME = process.env.VUE_APP_JWT_TOKEN_NAME

const SOCKET_IO_URL = process.env.VUE_APP_SOCKET_IO_URL

export {
  API_URL,
  REFRESH_JWT_TIME,
  JWT_TOKEN_NAME,
  SOCKET_IO_URL
}
