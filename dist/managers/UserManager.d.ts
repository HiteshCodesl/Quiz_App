import type { Socket } from "socket.io";
export type Users = {
    roomId: string;
    socket: Socket;
};
export declare class UserManager {
    private quizManager;
    constructor();
    addUser(socket: Socket): void;
    private createHandler;
}
//# sourceMappingURL=UserManager.d.ts.map