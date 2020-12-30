enum SocketIOEventName {
     // CONNECTION
     UserConnected = 'user-connected',
     UserDisconnected = 'user-disconnected',
     OnlineMembers= 'online-members',

     // ROOM
     UserJoinRoom='user-join-room',
     MessageRoom = 'message-room',

     // UPDATE
     Message = 'message',
     ChangeRoom = 'change-room',
     CreateRoom = 'create-room',

    Error='error'
}

export default SocketIOEventName
