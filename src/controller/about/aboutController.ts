
import { get, success } from 'black-ts'
import Koa from 'koa'
import { parseJson } from '../../untils'
import path from 'path'

class aboutController {

    @get('/about', { tokenVerify: false })
    async getAboutInfo(ctx: Koa.Context) {
        const aboutInfo = parseJson(path.join(__dirname, './about.json'))
        const res = aboutInfo[ctx.lang]

        // aboutInfo.developerInfo.jobTime = new Date().getTime() - new Date(aboutInfo.developerInfo.jobStartTime).getTime()

        //动态读取node的版本
        res.backEndInfo.node = process.version


        success(ctx, res)
    }
}