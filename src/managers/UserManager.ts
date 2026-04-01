import type { Socket } from "socket.io";
import { QuizManager } from "./QuizManager.js";
import { Quiz } from "../quiz.js";

const AdminPassword = "ADMIN_PASSWORD";

export type Users = {
    roomId: string;
    socket: Socket
}

export class UserManager {
    private quizManager;

    constructor() {
        this.quizManager = new QuizManager();
    }

    addUser(socket: Socket) {
        console.log("Inside addUser");
        this.createHandler(socket);
    }

    private createHandler(socket: Socket) {
        socket.on("message", (raw) => {
            const parsed = JSON.parse(raw);
            console.log("parsed")
            const data = parsed.data;
            console.log("data", data);

            if (parsed.type === "joinRoom") {
                console.log("Inside JoinRoom")
                const userId = this.quizManager.addUser(data.roomId, data.name);

                socket.emit("init", {
                    userId,
                    state: this.quizManager.getCurrentState(data.roomId)
                })
            }

            if (parsed.type === "joinRoomAdmin") {
                if (data.password !== AdminPassword) {
                    console.error("Password Not Matches")
                    return;
                }

                if(parsed.subtype === "createQuiz"){
                    this.quizManager.addQuiz(data.roomId)
                    console.log("quiz created");
                }

                if(parsed.subtype ===  "createProblem"){
                    const {problem, roomId} = parsed.data;

                    this.quizManager.addProblem(roomId, problem);
                }

                if(parsed.subtype === "next"){
                    this.quizManager.next(data.problem);
                }
            }

            if (parsed.type === "submit") {

                const userId = data.userId;
                const roomId = data.roomId;
                const submission = data.submission;
                const problemId = data.problemId;

                if (submission !== 0 || submission !== 1 || submission !== 2 || submission !== 3) {
                    console.error("Error WHile Getting Input" + submission);
                    return;
                }

                this.quizManager.submit(userId, roomId, problemId, submission)
            }
        })
    }
}