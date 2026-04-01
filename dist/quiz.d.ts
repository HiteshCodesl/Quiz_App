export type AllowedSubmission = 0 | 1 | 2 | 3;
export interface Submission {
    problemId: string;
    userId: string;
    selectedOption: AllowedSubmission;
    isCorrect: boolean;
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
    }[];
    submission: Submission[];
}
export interface Users {
    id: string;
    name: string;
    points: number;
}
declare enum CurrentState {
    NotStarted = "NOT_STARTED",
    Ended = "ENDED",
    LeaderBoard = "LEADERBOARD",
    Question = "QUESTION"
}
export declare class Quiz {
    private hasStarted;
    roomId: string;
    private problems;
    private activeProblem;
    private users;
    currentState: CurrentState;
    constructor(roomId: string);
    setActiveProblem(problem: Problem): void;
    sendLeaderBoard(): void;
    addProblem(problem: any): void;
    getLeaderBoard(): Users[];
    start(): void;
    next(roomId: string): void;
    generateString(length: number): string;
    addUser(name: string): string;
    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmission): void;
    getCurrentState(): any;
}
export {};
//# sourceMappingURL=quiz.d.ts.map