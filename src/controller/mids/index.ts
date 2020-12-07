import Koa from 'koa'
import Helper from '../../helper'
import { blackError } from 'black-ts'



export const verifyUserName = async (ctx: Koa.Context, next: Koa.Next) => {
    const { room_No, user_info } = ctx.request.body
    if (ctx.store.isHasUserName(room_No, user_info.user_name)) {
        throw new blackError(425, new Error(Helper.getMessage('M002')))
    }
    await next()
}