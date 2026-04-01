import http from "http";
import { Server } from "socket.io";
const server = http.createServer();
export class IoManager {
    static io;
    static instance;
    static getInstance() {
        console.log("Inside ioMnanager");
        if (!this.instance) {
            const io = new Server(server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            });
            this.io = io;
        }
        return this.io;
    }
}
//# sourceMappingURL=IoManager.js.map