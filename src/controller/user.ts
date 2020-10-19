import Koa from "koa";
import { get, logger, query, post, body } from "black-ts";
import { generateRandomNumbers } from "../untils";
import { Store } from "../store";
import { User } from "../type";

class UserController {
    /**
     * @param ctx
     */
    @post("/enter")
    @body({
        room_No: {
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
        const { room_No, user_info } = ctx.request.body;
        const store = ctx.store as Store;
        if (store.isHasRoom(room_No)) {
            store.joinRoom(<User>user_info, room_No);
            console.log(ctx.store);
            ctx.body = "欢迎进入该房间";
        } else {
            ctx.body = "该房间号不存在";
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
    @post("/create")
    async createRoom(ctx: Koa.Context) {
        //注意断言的处理
        const store = ctx.store as Store;
        const { room_No, user_info } = ctx.request.body;
        console.log(ctx.request.body);

        //传了room_No
        if (room_No) {
            if (store.isHasRoom(room_No)) {
                ctx.body = "该房间号已经被占用";
            } else {
                store.createRoom(<User>user_info, room_No);

                ctx.body = "创建房间成功";
            }
        } else {
            let randomRoomId = String(generateRandomNumbers(4));
            //验证随机创建的房间号不存在
            while (store.isHasRoom(randomRoomId)) {
                randomRoomId = String(generateRandomNumbers(4));
            }
            store.createRoom(<User>user_info, randomRoomId);
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
        console.log(ctx.request.body);
        console.log(ctx.store);

        ctx.body = "check store";
    }

    /**
     * @param ctx
     */
    @get("/quit")
    async quitRoom(ctx: Koa.Context) {
        const store = ctx.store as Store;
        const { room_No, user_id } = ctx.query;
        store.quitRoom(user_id, room_No);
        console.log(store);
        ctx.bode = "离开房间成功";
    }
}
