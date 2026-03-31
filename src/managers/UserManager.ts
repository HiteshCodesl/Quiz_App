import type { Socket } from "socket.io";
import { QuizManager } from "./QuizManager.js";

const AdminPassword = "ADMIN_PASSWORD";

export type Users = {
    roomId: string;
    socket: Socket
}

export class UserManager {
    private users: Users[];
    private quizManager;
    constructor() {
        this.users = [];
        this.quizManager = new QuizManager();
    }


    addUser(roomId: string, socket: Socket){
        this.users.push({
            roomId,
            socket
        })
        this.createHandler(roomId, socket);
    }

    private createHandler(roomId: string, socket: Socket){
        socket.on("joinroom", (data) => {
            const userId = this.quizManager.addUser(roomId, data.name);
            
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(roomId)
            })
        })

        socket.on("joinroom_admin", (data) => {
            if(data.password !== AdminPassword){
                console.error("Password Not Matches")
                return;
            }
            const userId = this.quizManager.addUser(roomId, data.name);
            
            socket.emit("admin_init", {
                userId,
                state: this.quizManager.getCurrentState(roomId)
            })

            socket.on("createProblem", data =>  {
                this.quizManager.addProblem(data.roomId, data.problem);
            })

            socket.on("next", data => {
                this.quizManager.next(data.problem);
            })
        })

        socket.on("submit", (data) => {
            const userId = data.userId;
            const roomId = data.roomId;
            const submission = data.submission;
            const problemId = data.problemId;

            if(submission != 0 || submission != 1 || submission != 2 || submission != 3){
                console.error("Error WHile Getting Input" + submission);
                return;
            }

            this.quizManager.submit(userId, roomId, problemId, submission)
        })
    }

}