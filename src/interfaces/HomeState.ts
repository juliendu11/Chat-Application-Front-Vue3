import { Socket } from 'socket.io-client'
import MemberOnline from './MemberOnline'
import Message from './Message'
import Room from './Room'

interface HomeState{
    rooms: Room[] | [];
    onlineMembers: MemberOnline[];
    roomSelected: Room |null;
    pendingRoomSelected: Room |null;
    socketIOClient: Socket |null;
    messages: Message[] | [];
    messageToSend: string;
}

export default HomeState
