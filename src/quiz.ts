import { IoManager } from "./managers/IoManager.js";

export interface Problem {
    id: string;
    title: string;
    description: string;
    image: string;
    answer: string;
    options: {
        id: number;
        title: string;
    }
}

export class Quiz {
    private hasStarted: boolean;
    private roomId: string;
    private problems: Problem[];
    private activeProblem: number;

    constructor(roomId: string) {
        this.hasStarted = false;
        this.roomId = roomId;
        this.problems = [];
        this.activeProblem = 0;
    }

    startQuiz(roomId: string) {
        this.hasStarted = true;
        const io = IoManager.getInstance();

        io.emit("Change_PROBLEM", {
            problem: this.problems[0]
        })
    }

    next(roomId: string) {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];

        const io = IoManager.getInstance();

        if (problem) {
            io.emit("Next_Question", {
                problem: problem
            })
        } else{
            io.emit("Quiz_Ended", {
                problem: problem
            })
        }
    }
}