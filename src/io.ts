import SocketIO from 'socket.io'
import { Store } from './store'
import { tokenVerify } from 'black-ts'
import { Constants } from './constants'
import { User } from './type'
export class Io {
    static IoServer: SocketIO.Server
    constructor(io: SocketIO.Server) {
        initIoMidwares(io)
        initIoEvent(io)
        Io.IoServer = io
    }
}
//自定义类型，但其实际来自于socket.io,因为socket.io中比较随意，故我单独拿了出来
type next = (err?: any) => void

const checkToken = (socket: SocketIO.Socket, next: next) => {
    const store = Store.getInstance()
    const { room_No, user_id, token } = socket.handshake.query
    try {
        tokenVerify(token)
        console.log('io mid success')
        next()
    } catch (error) {
        store.quitRoom(user_id, room_No)
        socket.leave(room_No)
        next(new Error('authentication error'))
        console.log('io mid fault')
    }
}

const initIoMidwares = (io: SocketIO.Server) => {
    io.use(checkToken)
}

const disconnect = (
    store: Store,
    socket: SocketIO.Socket,
    user_id: string,
    room_No: string
) => {
    const { user_name } = store.getUserInfo(room_No, user_id) as User
    //自己离开房间
    store.quitRoom(user_id, room_No)
    //通知其它用户我离开
    socket.to(room_No).emit(Constants.EVENT_TYPE.LEAVE, {
        leave_user_name: user_name,
        room_info: store.rooms[room_No],
    })
    console.log(store, '有人离开之后store')
    socket.leave(room_No)
    socket.disconnect(true)
}

const initIoEvent = (io: SocketIO.Server) => {
    const store = Store.getInstance()
    io.on(Constants.EVENT_TYPE.CONNECT, (socket: SocketIO.Socket) => {
        console.log('connect')
        const { room_No, user_id, token } = socket.handshake.query
        socket.join(room_No, () => {
            socket
                .to(room_No)
                .emit(
                    Constants.EVENT_TYPE.JOIN,
                    store.getUserInfo(room_No, user_id)
                )
        })

        socket.on(Constants.EVENT_TYPE.SEND, (msg: any) => {
            try {
                tokenVerify(token)
                socket.to(room_No).emit(Constants.EVENT_TYPE.ACCEPT, msg)
            } catch (error) {
                socket.emit(Constants.EVENT_TYPE.TOKEN_EXPORED, error)
                disconnect(store, socket, user_id, room_No)
            }
        })

        socket.on(Constants.EVENT_TYPE.DISCONNECT, (reason: string) => {
            console.log('disconnect')
            disconnect(store, socket, user_id, room_No)
        })

        socket.on(Constants.EVENT_TYPE.ERROR, (error: any) => {
            console.log('socket error', error)
        })
    })
}
