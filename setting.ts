import { Setting } from "black-ts"

const setting: Setting = {
    token: false,
    database: false,
    httplog: true,
    tconfig: {
        secret: "zhangyue",
        option: {
            expiresIn: 60 * 30, //30分钟过期,秒为单位
            //algorithm: 'RS256'//加密算法
        },
        //特殊的接口要放开，以下就是放开图片请求,经过思考，我的框架只给controller中的所有接口加了验证，顾图片请求默认就不验证，所以以下可以删除
        whiteList: ["/upload_images"],
    },
    dconfig: {
        url: "mongodb://127.0.0.1:27017/blog",
        option: {
            useNewUrlParser: true,

            useUnifiedTopology: true,

            useFindAndModify: false,
        },
    },
}

export default setting

