import { Room, User, Rooms } from './type'
import { remove } from './untils'

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
    createRoom(user: User, room_No: string) {
        const newRoom: Room = {
            users: [user],
            user_count: 1,
        }
        this.rooms[room_No] = newRoom
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
    quitRoom(user_id: string, room_No: string) {
        this.rooms[room_No].users = this.rooms[room_No].users.filter((user) => {
            return user.user_id !== user_id
        })
        //判断是否是房间内的最后一个人
        if (this.rooms[room_No].user_count - 1 < 1) {
            this.deleteRoom(room_No)
        } else {
            this.rooms[room_No].user_count -= 1
        }
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
     * @@param user_id
     */
    getUserInfo(room_No: string, user_id: string): User | undefined {
        for (const user of this.rooms[room_No].users) {
            if (user.user_id === user_id) {
                return user
            }
        }
    }
}
