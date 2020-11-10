import SocketIO from "socket.io"
import { Store } from "./store"
import { tokenVerify } from "black-ts"
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
        console.log('io mid success');
        next();
    } catch (error) {
        store.quitRoom(user_id, room_No)
        socket.leave(room_No)
        next(new Error('authentication error'));
        console.log('io mid fault');
    }
}



const initIoMidwares = (io: SocketIO.Server) => {
    io.use(checkToken)
}

const disconnect = (store: Store, socket: SocketIO.Socket, user_id: string, room_No: string) => {
    //其它用户离开
    socket.to(room_No).emit('leave', user_id)
    // socket.to(room_No).emit('leave', store.getUserInfo(room_No, user_id))
    //自己离开房间
    store.quitRoom(user_id, room_No)
    socket.leave(room_No)
    socket.disconnect(true)
}


const initIoEvent = (io: SocketIO.Server) => {
    const store = Store.getInstance()
    io.on('connect', socket => {
        console.log('connect');
        const { room_No, user_id, token } = socket.handshake.query
        socket.join(room_No, () => {
            socket.to(room_No).emit('join', store.getUserInfo(room_No, user_id))
        })

        socket.on('send', msg => {
            try {
                tokenVerify(token)
                socket.to(room_No).emit('accept', msg)
            } catch (error) {
                socket.emit('tokenExpired', error)
                disconnect(store, socket, user_id, room_No)
            }
        })

        socket.on('disconnect', (reason) => {
            console.log("disconnect");
            disconnect(store, socket, user_id, room_No)
        });

        socket.on('error', (error) => {
            console.log('socket error', error);
        });

    })

}