import Koa from "koa";
import { get, logger, query } from "black-ts";
import { generateRandomNumbers } from "../untils"
import { Store } from "../store"


class User {
    /**
     * @param ctx
     */
    @get("/enter")
    @query({
        room_id: {
            type: "string",
            // validator: (rule: any, value: string) => {
            //     if (value !== "zhangyue") {
            //         return new Zhangyue(200, "FANGJIAN HAO BU CUN ZAI");
            //     }
            //     return true;
            // },
        },
    })
    async enter(ctx: Koa.Context) {
        // 1.验证房间号是否存在
        const { room_id, name } = ctx.query
        const store = ctx.store as Store
        if (store.isHasRoom(room_id)) {
            store.joinRoom(name, room_id)
            console.log(ctx.store);
            ctx.body = "欢迎进入该房间";
        } else {
            ctx.body = '该房间号不存在'
        }
        // 2.房间不存在，返回房间不存在
        // 3.房间存在，让其进入房间
        // 4.进入房间后，房间人数加1，更新房间需要更新的内容
        // console.log('test');
        // logger.log({
        //     level: 'info',
        //     message: 'Hello distributed log files!'
        // });
    }

    /**
     * @param ctx
     */
    @get("/create")
    async createRoom(ctx: Koa.Context) {
        //注意断言的处理
        const store = ctx.store as Store
        const { room_id, name } = ctx.query
        //传了room_id
        if (room_id) {
            if (store.isHasRoom(room_id)) {
                ctx.body = "该房间号已经被占用";
            } else {
                store.createRoom(name, room_id)
                console.log(ctx.store);
                ctx.body = "创建房间成功";
            }
        } else {
            let randomRoomId = String(generateRandomNumbers(4))
            //验证随机创建的房间号不存在
            while (store.isHasRoom(randomRoomId)) {
                randomRoomId = String(generateRandomNumbers(4))
            }
            store.createRoom(name, randomRoomId)
            console.log(store);
            ctx.body = "创建随机房间成功";
        }
    }

    /**
     * 
     * @param ctx test
     */

    @get("/test")
    async check(ctx: Koa.Context) {
        console.log(ctx.store);
        ctx.body = "check store";
    }

    /**
     * @param ctx
     */
    @get("/quit")
    async quitRoom(ctx: Koa.Context) {
        const store = ctx.store as Store
        const { room_id, name } = ctx.query
        store.quitRoom(name, room_id)
        console.log(store);
        ctx.bode = "离开房间成功"
    }
}
