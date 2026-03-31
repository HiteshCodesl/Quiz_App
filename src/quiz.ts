import { IoManager } from "./managers/IoManager.js";

export type AllowedSubmission = 0 | 1 | 2 | 3;

const PROBLEM_TIME = 20;

export interface Submission {
    problemId: string,
    userId: string,
    selectedOption: AllowedSubmission,
    isCorrect: boolean
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    image: string;
    startTime: number;
    answer: AllowedSubmission;
    options: {
        id: number;
        title: string;
    }[],
    submission: Submission[]
}

export interface Users {
    id: string;
    name: string;
    points: number;
}

enum CurrentState {
    NotStarted = 'NOT_STARTED',
    Ended = "ENDED",
    LeaderBoard = "LEADERBOARD",
    Question = "QUESTION"
}

export class Quiz {
    private hasStarted: boolean;
    public roomId: string;
    private problems: Problem[];
    private activeProblem: number;
    private users: Users[];
    public currentState: CurrentState;

    constructor(roomId: string) {
        this.hasStarted = false;
        this.roomId = roomId;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = CurrentState.NotStarted;
    }

    setActiveProblem(problem: Problem) {
        problem.startTime = new Date().getTime();
        problem.submission = [];

        IoManager.getInstance().emit("Next_Problem", {
            problem
        })

        setTimeout(() => {
            this.sendLeaderBoard();
        }, PROBLEM_TIME * 1000)
    }

    sendLeaderBoard() {
        const leaderBoard = this.getLeaderBoard().splice(0, 20);

        IoManager.getInstance().to(this.roomId).emit("LeaderBoard", {
            leaderBoard
        })
    }

    addProblem(problem: any){
        this.problems.push(problem);
    }

    getLeaderBoard() {
        return this.users.sort((a, b) => a.points < b.points ? -1 : 1).slice(0, 20);
    }

    public start() {
        this.hasStarted = true;
        const problem = this.problems[0];
        if(!problem){
            return;
        }
        this.setActiveProblem(problem)
    }

    next(roomId: string) {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];

        const io = IoManager.getInstance();

        if (problem) {
            problem.startTime = new Date().getTime();
            io.emit("Next_Question", {
                problem: problem
            })
        } else {
            io.emit("Quiz_Ended", {
                problem: problem
            })
        }
    }

    generateString(length: number) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    addUser(name: string) {
        const userId = this.generateString(7);

        this.users.push({
            id: userId,
            name,
            points: 0
        })

        return userId;
    }

    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmission) {
        const problem = this.problems.find(x => x.id === problemId);
        const user = this.users.find(x => x.id === userId);

        if (!problem || !user) {
            console.log("problem or user not found")
            return;
        }

        const existingSubmission = problem.submission.find(x => x.userId === userId);

        if (existingSubmission) {
            console.error("Already Submitted the answer" + submission);
            return;
        }
        problem.submission.push({
            problemId,
            userId,                         
            selectedOption: submission,
            isCorrect: problem.answer === submission
        })

        user.points += 1000 * (new Date().getTime() - problem.startTime) / (PROBLEM_TIME * 500);
    }

    getCurrentState(): any{
        if(this.currentState === CurrentState.NotStarted){
            return {
                type: CurrentState.NotStarted
            }
        } 

        if(this.currentState === CurrentState.Ended){
            return {
                type: CurrentState.Ended
            }
        }

        if(this.currentState === CurrentState.LeaderBoard){
            const leaderBoard = this.getLeaderBoard();
            return {
                type: CurrentState.LeaderBoard,
                leaderBoard
            }
        }

        if(this.currentState === CurrentState.Question){
            const question = this.problems[this.activeProblem];
            return {
                type: CurrentState.Question,
                question
            }
        }
    }
}