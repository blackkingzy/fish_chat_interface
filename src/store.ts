import { Room, User, Rooms } from "./type";
import { remove } from "./untils";

export class Store {
    public static instance: Store | undefined

    public room_count = 0;

    public rooms: Rooms = {};

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
     * @param room_id
     */
    createRoom(user: User, room_id: string) {
        const newRoom: Room = {
            users: [user],
            user_count: 1,
        };
        this.rooms[room_id] = newRoom;
        this.room_count += 1
    }

    /**
     * 加入房间
     * @param user
     * @param room_id
     */
    joinRoom(user: User, room_id: string) {
        this.rooms[room_id].users.push(user);
        this.rooms[room_id].user_count++;
    }

    /**
     * 离开房间
     * @param user
     * @param room_id
     */
    quitRoom(user: User, room_id: string) {
        this.rooms[room_id].users = this.rooms[room_id].users.filter((item) => {
            //改为post请求后再改回来
            // return item.name !== user.name;
            return item !== user;
        });
        //判断是否是房间内的最后一个人
        if (this.rooms[room_id].user_count - 1 < 1) {
            this.deleteRoom(room_id)
        } else {
            this.rooms[room_id].user_count -= 1
        }
    }

    /**
     * 删除房间
     * @param room_id
     */
    deleteRoom(room_id: string) {
        delete this.rooms[room_id]
        this.room_count -= 1
    }

    /**
     * 是否有这个房间
     * @param check_room_id
     */
    isHasRoom(check_room_id: string): boolean {
        for (const room_id in this.rooms) {
            if (room_id === check_room_id) {
                return true;
            }
        }
        return false;
    }
}

