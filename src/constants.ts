export class Constants {
    public static EVENT_TYPE = {
        CONNECT: 'connect',
        SEND: 'send', //客户端发送事件
        JOIN: 'join', //新用户加入房间后，要广播给其它用户
        ACCEPT: 'accept', //消息传递
        LEAVE: 'leave', //用户离开房间后，广播给其它用户
        TOKEN_EXPORED: 'tokenExpired', //token过期事件
        DISCONNECT: 'disconnect', // 断开连接事件
        ERROR: 'error', //连接失败事件
    }
}
