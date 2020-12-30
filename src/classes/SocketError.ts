import SocketIOErrorName from '../enums/SocketIOErrorName'

class SocketError {
    Errorname: SocketIOErrorName
    Message: string

    constructor (errorName: SocketIOErrorName, message: string) {
      this.Errorname = errorName
      this.Message = message
    }
}

export default SocketError
