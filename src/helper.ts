import util from 'util'

export default class Helper {
    public static lang: lang = 'cn'

    public static cn: message_type

    public static en: message_type

    public static getMessage(msg_id: string, ...load: loadParameter[]): string {
        if (load.length) {
            //message的写法参照util.format的文档,例如%s、%d
            return util.format(this[this.lang][msg_id], ...load)
        }
        return this[this.lang][msg_id]
    }
}

type message_type = { [key: string]: string }

type loadParameter = string | number

export type lang = 'cn' | 'en'
