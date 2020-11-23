import { Black } from 'black-ts'
import { EnableSocketServer } from './factory'
import { initStore, initMessage } from './mids'

const black = new Black({
    factory: [EnableSocketServer],
    mids: [initStore, initMessage],
})

black.listen(3010) //删除进程
