
export interface User {
    name: string;
}

export interface Room {
    users: Array<User>
    user_count: number
}

export interface Rooms {
    [room_id: string]: Room
}