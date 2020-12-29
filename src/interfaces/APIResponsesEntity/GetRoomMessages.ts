import Message from '../Message'

interface GetRoomMessages {
    messages: Message[];
    moreAvailable: boolean;
    pageAvailable: number;
}

export default GetRoomMessages
