import { Room, User, Rooms, Message } from './type'
import SocketIO from 'socket.io'
import { Constants } from './constants'

export class Store {
    public static instance: Store | undefined

    public room_count = 0

    public rooms: Rooms = {}

    /**
     * 获取实例
     * 单例模式
     */
    public static getInstance() {
        if (!Store.instance) {
            Store.instance = new Store()
            return Store.instance
        }
        return Store.instance
    }

    /**
     * 创建房间
     * @param user
     * @param room_No
     */
    createRoom(user: User, room_info: any) {
        const newRoom: Room = {
            room_password: room_info.room_password,
            users: [user],
            user_count: 1,
            chat_history: [],
        }
        this.rooms[room_info.room_No] = newRoom
        this.room_count += 1
    }

    /**
     * 加入房间
     * @param user
     * @param room_No
     */
    joinRoom(user: User, room_No: string) {
        this.rooms[room_No].users.push(user)
        this.rooms[room_No].user_count++
    }

    /**
     * 离开房间
     * @param user
     * @param room_No
     */
    async quitRoom(room_No: string, socket_id: string) {
        const user = this.getUserInfo(room_No, socket_id)
        const socket = user.getUserSocket()
        const user_name_leave = user.user_name
        for (let i = 0; i < this.rooms[room_No].users.length; i++) {
            if (this.rooms[room_No].users[i].socket_id === socket_id) {
                this.rooms[room_No].users.splice(i, 1)
                break
            }
        }
        //判断是否是房间内的最后一个人
        if (this.rooms[room_No].user_count - 1 < 1) {
            this.deleteRoom(room_No)
        } else {
            this.rooms[room_No].user_count -= 1
        }
        if (socket) {
            socket.leave(room_No)
            socket.to(room_No).emit(Constants.EVENT_TYPE.LEAVE, {
                leave_user_name: user_name_leave,
                room_info: this.rooms[room_No],
            })
        }
        console.log(this, '有人离开之后store')
    }

    /**
     * 删除房间
     * @param room_No
     */
    deleteRoom(room_No: string) {
        delete this.rooms[room_No]
        this.room_count -= 1
    }

    /**
     * 是否有这个房间
     * @param check_room_No
     */
    isHasRoom(check_room_No: string): boolean {
        for (const room_No in this.rooms) {
            if (room_No === check_room_No) {
                return true
            }
        }
        return false
    }

    /**
     * 获取用户具体信息
     * @@param socket_id
     */
    getUserInfo(room_No: string, socket_id: string): User {
        for (const user of this.rooms[room_No].users) {
            if (user.socket_id === socket_id) {
                return user
            }
        }
        return new User()
    }

    /**
     * 获取用户具体信息
     * @@param user_id
     */
    getUserInfoByUserId(room_No: string, user_id: string): User {
        for (const user of this.rooms[room_No].users) {
            if (user.user_id === user_id) {
                return user
            }
        }
        return new User()
    }

    /**
     * 判断某房间内是否已经有人在用某昵称,避免昵称重复导致无法分别人
     * @param room_No
     * @param user_name
     */
    isHasUserName(room_No: string, user_name: string): boolean {
        for (const user of this.rooms[room_No].users) {
            if (user.user_name === user_name) return true
        }
        return false
    }

    /**
     * 更新历史记录
     * @param room_No
     * @param msg
     */
    updateHistory(room_No: string, msg: Message) {
        this.rooms[room_No].chat_history.push(msg)
    }

    /**
     * 该房间是否有这人
     * @param room_No
     * @param user_id
     */
    isHasUser(room_No: string, user_id: string): boolean {
        for (const user of this.rooms[room_No].users) {
            if (user.user_id === user_id) {
                return true
            }
        }
        return false
    }

    /**
     * 房间是否有有密码
     * @param room_No 
     */
    getRoomPassword(room_No: string): string {
        return this.rooms[room_No].room_password
    }

    /**
     * 密码验证
     * @param room_No
     * @param password
     */
    verifyPassword(room_No: string, password: string): boolean {
        if (this.rooms[room_No].room_password && password === this.rooms[room_No].room_password) {
            return true
        }
        return false
    }
}
