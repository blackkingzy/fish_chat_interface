
export interface User {
    user_id: string;
    user_name: string;
}

export interface Room {
    users: Array<User>
    user_count: number
}

export interface Rooms {
    [room_No: string]: Room
}