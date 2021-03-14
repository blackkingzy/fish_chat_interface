import SocketIO from 'socket.io'
import { Black } from 'black-ts'
export class User {
    public user_id = ''
    public user_name = ''
    public socket_id = ''

    public setUserId(value: string) {
        this.user_id = value
    }
    public getUserId() {
        return this.user_id
    }
    public setUserName(value: string) {
        this.user_name = value
    }
    public getUserName() {
        return this.user_name
    }
    public setSocketId(id: string) {
        this.socket_id = id
    }
    public getSocketId() {
        return this.socket_id
    }

    public getUserSocket() {
        return Black.getInstance().io.sockets.sockets[this.socket_id]
    }
}

export interface Room {
    room_password: string,
    users: Array<User>
    user_count: number
    chat_history: Array<Message>
}

export interface Rooms {
    [room_No: string]: Room
}

export interface Message {
    user_id: string
    user_name: string
    message_content: string
}
