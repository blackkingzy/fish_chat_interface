import Koa from 'koa'
import {
    get,
    del,
    success,
    post,
    body,
    generate,
    blackError,
    tokenVerify,
} from 'black-ts'
import { generateRandomNumbers } from '../untils'
import { Store } from '../store'
import { User } from '../type'
import Helper from '../helper'
import { verifyUserName } from './mids'

class UserController {
    /**
     * @param ctx
     */
    @post('/enter', { tokenVerify: false, middlewares: [verifyUserName] })
    @body({
        room_No: {
            type: 'string',
            required: true,
        },
        user_info: {
            type: 'object',
            required: true,
            fields: {
                user_id: { type: 'string', required: true },
                user_name: {
                    type: 'string',
                    required: true,
                },
            },
        },
    })
    async enter(ctx: Koa.Context) {
        // 1.验证房间号是否存在
        const { room_No, user_info } = ctx.request.body
        
        console.log(ctx.request.body)
        let res = null

        const store = ctx.store as Store
        if (store.isHasRoom(room_No)) {
            const user = new User()
            user.setUserId(user_info.user_id)
            user.setUserName(user_info.user_name)
            store.joinRoom(user, room_No)
            console.log(ctx.store)
            res = {
                token: generate({ room_No, user_info }),
                room_No: room_No,
                room_info: store.rooms[room_No],
            }
            success(ctx, res)
        } else {
            throw new blackError(425, new Error('The room does not exist'))
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
                const user = new User()
                user.setUserId(user_info.user_id)
                user.setUserName(user_info.user_name)
                store.createRoom(<User>user, room_No)
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
            const user = new User()
            user.setUserId(user_info.user_id)
            user.setUserName(user_info.user_name)
            store.createRoom(user, randomRoomNo)
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

    @get('/info', { tokenVerify: false })
    async getInfo(ctx: Koa.Context) {
        const store = ctx.store as Store
        let res = null
        let res_room_No: string
        const user = new User()

        //改为手动验证token
        try {
            const { user_info, room_No } = tokenVerify(
                ctx.headers.authorization
            )
            user.setUserId(user_info.user_id)
            user.setUserName(user_info.user_name)
            res_room_No = room_No
            console.log(ctx.cookies.get('io'));       
        } catch (error) {
            const room_no = ctx.cookies.get('room_no')
            const io = ctx.cookies.get('io')
            await store.quitRoom(room_no as string, io as string)
            console.log(store)
            throw new blackError(423, error)
        }
        res = {
            user_info: user,
            room_No: res_room_No,
            room_info: store.rooms[res_room_No],
        }
        success(ctx, res)
    }

    /**
     * @param ctx
     */
    @del('/quit', { tokenVerify: false })
    async quitRoom(ctx: Koa.Context) {
        const store = ctx.store as Store
        const room_No = ctx.cookies.get('room_no')
        const socket_id = ctx.cookies.get('io')
        await store.quitRoom(room_No as string, socket_id as string)
        console.log(store)
        success(ctx)
    }
}
