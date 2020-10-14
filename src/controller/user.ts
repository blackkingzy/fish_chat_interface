import Koa from "koa";
import { get, logger, query } from "black-ts";

class User {
    /**
     * @param ctx
     */
    @get("/enter")
    @query({
        room_id: {
            type: "string",
            validator: (rule: any, value: string) => {
                if (value !== "zhangyue") {
                    return new Error("FANGJIAN HAO BU CUN ZAI");
                }
                return true;
            },
        },
        zhangyue: {
            required: true,
        },
    })
    async enter(ctx: Koa.Context) {
        // 1.验证房间号是否存在
        // if(store.isHasRoom()){

        // }else{
        //     ctx.body = '该房间号不存在'
        // }
        // 2.房间不存在，返回房间不存在
        // 3.房间存在，让其进入房间
        // 4.进入房间后，房间人数加1，更新房间需要更新的内容
        // console.log('test');
        // logger.log({
        //     level: 'info',
        //     message: 'Hello distributed log files!'
        // });
        ctx.body = "欢迎来到TS的世界";
    }

    /**
     * @param ctx
     */
    @get("/create")
    async createRoom(ctx: Koa.Context) {
        // 1.创建房间，传了房间号就用，没传就随机生成一个房间号创建并返回房间号
    }

    /**
     * @param ctx
     */
    @get("/quit")
    async quitRoom(ctx: Koa.Context) {
        // 1.离开房间，主动断开连接，并且房间人数少1，更新房间内该更新的信息
    }
}
