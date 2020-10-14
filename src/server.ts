import { Black } from "black-ts"
import { EnableSocketServer } from "./factory"


const black = new Black({
    factory: [EnableSocketServer]
})


black.listen(3010)