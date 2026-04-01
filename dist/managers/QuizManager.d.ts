import { type AllowedSubmission, Quiz } from "../quiz.js";
export declare let globalProblemId: number;
export declare class QuizManager {
    private quizes;
    constructor();
    start(roomId: string): void;
    next(roomId: string): void;
    addUser(roomId: string, name: string): string | undefined;
    getQuiz(roomId: string): Quiz | undefined;
    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmission): void;
    getCurrentState(roomId: string): any;
    addProblem(roomId: string, problem: {
        title: string;
        description: string;
        image: string;
        options: {
            id: number;
            title: string;
        }[];
        answer: AllowedSubmission;
    }): void;
    addQuiz(roomId: string): void;
}
//# sourceMappingURL=QuizManager.d.ts.map