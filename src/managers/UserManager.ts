import type { Socket } from "socket.io";

export type Users = {
    roomId: string;
    socket: Socket
}

export class UserManager {
    private users: Users[];
    constructor() {
        this.users = [];
    }


    addUser(roomId: string, socket: Socket){
        this.users.push({
            roomId,
            socket
        })
    }
}