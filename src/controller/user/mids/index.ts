import Koa from 'koa'
import Helper from '../../../helper'
import { blackError } from 'black-ts'
import { Constants } from '../../../constants'



export const verifyUserName = async (ctx: Koa.Context, next: Koa.Next) => {
    const { room_info, user_info } = ctx.request.body
    console.log(ctx.request.body);

    if (ctx.store.isHasUserName(room_info.room_No, user_info.user_name)) {
        throw new blackError(Constants.CUSTOM_STATUS_CODE.NICKNAME_OCCUPIED, new Error(Helper.getMessage('M002')))
    }
    await next()
}