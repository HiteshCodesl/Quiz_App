import { Quiz } from "../quiz.js";
import { IoManager } from "./IoManager.js";
export let globalProblemId = 0;
export class QuizManager {
    quizes;
    constructor() {
        this.quizes = [];
    }
    start(roomId) {
        const io = IoManager.getInstance();
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
        }
        console.log("quiz started", quiz);
        quiz?.start();
    }
    next(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            console.error("Quiz Not Found");
            return;
        }
        quiz.next(roomId);
    }
    addUser(roomId, name) {
        const quiz = this.getQuiz(roomId)?.addUser(name);
        if (!quiz) {
            console.error("Quiz Not Found");
            return;
        }
        return quiz;
    }
    getQuiz(roomId) {
        return this.quizes.find(x => x.roomId === roomId);
    }
    submit(userId, roomId, problemId, submission) {
        this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
    }
    getCurrentState(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            console.error("Quiz Not Found");
            return;
        }
        return quiz.getCurrentState();
    }
    addProblem(roomId, problem) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.addProblem({
            id: globalProblemId++,
            ...problem,
            startTime: new Date().getTime(),
            submission: []
        });
    }
    addQuiz(roomId) {
        if (this.getQuiz(roomId)) {
            return;
        }
        const quiz = new Quiz(roomId);
        this.quizes.push(quiz);
    }
}
//# sourceMappingURL=QuizManager.js.map