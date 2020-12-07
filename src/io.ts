import SocketIO from 'socket.io'
import { Store } from './store'
import { tokenVerify } from 'black-ts'
import { Constants } from './constants'
import { User, Message } from './type'
import { formatCookies } from './untils'
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
    const { room_No, token } = socket.handshake.query
    const { io: socket_id } = formatCookies(socket.handshake.headers.cookie)
    try {
        tokenVerify(token)
        console.log('io mid success')
        next()
    } catch (error) {
        store.quitRoom(room_No, socket_id)
        socket.leave(room_No)
        next(new Error('authentication error'))
        console.log('io mid fault')
    }
}

const initIoMidwares = (io: SocketIO.Server) => {
    io.use(checkToken)
}

const initIoEvent = (io: SocketIO.Server) => {
    const store = Store.getInstance()
    io.on(Constants.EVENT_TYPE.CONNECT, (socket: SocketIO.Socket) => {
        const { room_No, token } = socket.handshake.query
        const { user_info } = tokenVerify(token)

        const { io: socket_id } = formatCookies(socket.handshake.headers.cookie)

        const user = store.getUserInfoByUserId(room_No, user_info.user_id)

        socket.join(room_No)
        //判断是否是刷新或者关闭页面重新进入
        !socket_id || (user.user_id && !user.getSocketId())
            ? socket.to(room_No).emit(Constants.EVENT_TYPE.JOIN, user)
            : ''
        //刷新更新用户的socket_id
        user.setSocketId(socket.id)

        socket.on(Constants.EVENT_TYPE.SEND, (msg: Message) => {
            try {
                tokenVerify(token)
                store.updateHistory(room_No, msg)
                socket.to(room_No).emit(Constants.EVENT_TYPE.ACCEPT, msg)
            } catch (error) {
                socket.emit(Constants.EVENT_TYPE.TOKEN_EXPORED, error)
                store.quitRoom(room_No, socket_id)
            }
        })

        socket.on(Constants.EVENT_TYPE.DISCONNECT, (reason: string) => {
            //注意：一旦断开连接,该服务就没有了断开连接的socket
            console.log('disconnect', reason)
        })

        socket.on(Constants.EVENT_TYPE.ERROR, (error: any) => {
            console.log('socket error', error)
        })
    })
}
