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

    public static CUSTOM_STATUS_CODE = {
        VALIDATION_ERROR: 422, //请求参数字段验证错误
        TOKEN_ERROR: 423, //token 一系列错误
        ROOM_OCCUPIED: 424, //房间被占用
        ROOM_NOT_EXIST: 425, //房间不存在
        PASSWORD_ERROR: 426,//密码错误
        NICKNAME_OCCUPIED: 427,//昵称被占用
    }
}
