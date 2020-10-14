import SocketIO from "socket.io"
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
    // let clientId = socket.handshake.headers['x-clientid'];
    // if (isValid(clientId)) {
    //     return next();
    // }
    // return next(new Error('authentication error'));
    console.log(socket.rooms);
    // console.log('socket mid');
    next()
}



const initIoMidwares = (io: SocketIO.Server) => {
    io.use(checkToken)
}



const initIoEvent = (io: SocketIO.Server) => {
    io.on('connection', socket => {
        console.log('初始化成功！下面可以用socket绑定事件和触发事件了');

        socket.join("123", () => {
            socket.to('123').emit('add','有新人加入了')
        })

        socket.on('send', data => {
            console.log('客户端发送的内容：', data);
            console.log(socket.rooms);
            socket.to('123').emit('send1', data)
        })

        socket.on('error', (error) => {
            console.log(error);

        });
        socket.on('disconnect', function () {
            console.log("disconnect");
        });

    })

}