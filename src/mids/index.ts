import Koa from 'koa'
import { Store } from '../store'
import Helper, { lang } from '../helper'
import { parseJson } from '../untils'
import path from 'path'
import fs from 'fs'

//挂载store中间件
export const initStore = async (ctx: Koa.Context, next: Koa.Next) => {
    ctx.store = Store.getInstance()
    await next()
}

const readJson = (folder: string) => {
    //读取json,全局装载message
    Helper.cn = parseJson(path.join(folder, './cn.json'))
    Helper.en = parseJson(path.join(folder, './en.json'))
    return async (ctx: Koa.Context, next: Koa.Next) => {
        //实时获取cookies中的lang值
        const lang = ctx.cookies.get('lang') || 'cn'
        Helper.lang = lang as lang
        ctx.lang = lang
        await next()
    }
}
//message国际化全局中间件
export const initMessage = readJson(path.join(__dirname, '../message'))
