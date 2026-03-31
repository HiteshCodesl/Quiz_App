import type { Problem, AllowedSubmission, Quiz } from "../quiz.js";
import { IoManager } from "./IoManager.js";

export let globalProblemId = 0;
export class QuizManager {
    private quizes: Quiz[];

    constructor() {
        this.quizes = [];
    }

    public start(roomId: string){
        const io = IoManager.getInstance();

        const quiz = this.getQuiz(roomId);

        quiz?.start();
    }

    public next(roomId: string) {
        const quiz = this.getQuiz(roomId);

        if (!quiz) {
            console.error("Quiz Not Found");
            return;
        }

        quiz.next(roomId);
    }

    addUser(roomId: string, name: string) {
        const quiz = this.getQuiz(roomId)?.addUser(name);

        if (!quiz) {
            console.error("Quiz Not Found");
            return;
        }

        return quiz;
    }

    getQuiz(roomId: string) {
        return this.quizes.find(x => x.roomId === roomId);
    }

    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmission) {
        this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
    }

    getCurrentState(roomId: string) {
        const quiz = this.getQuiz(roomId);

        if (!quiz) {
            console.error("Quiz Not Found");
            return;
        }

        return quiz.getCurrentState();
    }

    public addProblem(roomId: string, problem: {
        title: string,
        description: string,
        image: string,
        options: {
            id: number;
            title: string;
        }[],
        answer: AllowedSubmission;
    }){
        const quiz = this.getQuiz(roomId);
        if(!quiz){
            return;
        }

        quiz.addProblem({
            id: globalProblemId,
            ...problem,
            startTime: new Date().getTime(),
            submission: []
        })
    }
}