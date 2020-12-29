import Message from './Message'

interface Room{
    name: string;
    registeredAt: string;
    messages: Message[];
    isPrivate: boolean;
    password: string;
}

export default Room
