import Koa from 'koa'
import { get, success, post, body, generate, blackError } from 'black-ts'
import { generateRandomNumbers } from '../untils'
import { Store } from '../store'
import { User } from '../type'
import Helper from '../helper'

class UserController {
    /**
     * @param ctx
     */
    @post('/enter', { tokenVerify: false })
    @body({
        room_No: {
            type: 'string',
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
        const { room_No, user_info } = ctx.request.body
        console.log(ctx.request.body)
        let res = null

        const store = ctx.store as Store
        if (store.isHasRoom(room_No)) {
            store.joinRoom(<User>user_info, room_No)
            console.log(ctx.store)
            res = {
                token: generate({ room_No, user_info }),
                room_No: room_No,
                room_info: store.rooms[room_No],
            }
            success(ctx, res)
        } else {
            throw new blackError(423, new Error('The room does not exist'))
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
    @post('/create', { tokenVerify: false })
    async createRoom(ctx: Koa.Context) {
        //注意断言的处理
        const store = ctx.store as Store
        const { room_No, user_info } = ctx.request.body
        console.log(ctx.request.body)
        let res = null

        //传了room_No
        if (room_No) {
            if (store.isHasRoom(room_No)) {
                throw new blackError(424, new Error(Helper.getMessage('M001')))
            } else {
                store.createRoom(<User>user_info, room_No)
                console.log(store)
                res = {
                    token: generate({ room_No, user_info }),
                    room_No: room_No,
                    room_info: store.rooms[room_No],
                }
                success(ctx, res)
            }
        } else {
            let randomRoomNo = String(generateRandomNumbers(4))
            //验证随机创建的房间号不存在
            while (store.isHasRoom(randomRoomNo)) {
                randomRoomNo = String(generateRandomNumbers(4))
            }
            store.createRoom(<User>user_info, randomRoomNo)
            console.log(store)
            res = {
                token: generate({ room_No: randomRoomNo, user_info }),
                room_No: randomRoomNo,
                room_info: store.rooms[randomRoomNo],
            }
            success(ctx, res)
        }
    }

    /**
     *
     * @param ctx test
     */

    @get('/info')
    async getInfo(ctx: Koa.Context) {
        const store = ctx.store as Store
        let res = null
        //获取解码token的数据

        const { user_info, room_No } = ctx.data
        //判断该房间是否被占用,如果没有被占用,就重新创建该房间
        if (store.isHasRoom(room_No)) {
            //该房间被占用
            throw new blackError(424, new Error('The room is already occupied'))
        } else {
            //该房间没有被占用
            store.createRoom(<User>user_info, room_No)
            res = {
                user_info: user_info,
                room_No: room_No,
                room_info: store.rooms[room_No],
            }
            success(ctx, res)
        }
    }

    /**
     * @param ctx
     */
    @get('/test', { tokenVerify: false })
    async test(ctx: Koa.Context) {
        ctx.body = Helper.getMessage('M001')
    }
}
