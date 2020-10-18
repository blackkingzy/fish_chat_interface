import Koa from "koa";
import { Store } from "../store"

export const initStore = async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.store = Store.getInstance()
    await next()
}