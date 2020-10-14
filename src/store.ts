import { Room, User, Rooms } from "./type";
import { remove } from "./untils";

class Store {
    public room_count = 0;

    public rooms: Rooms = {};

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
            return item.name !== user.name;
        });
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


export default new Store()
