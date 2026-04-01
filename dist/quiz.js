import { IoManager } from "./managers/IoManager.js";
const PROBLEM_TIME = 20;
var CurrentState;
(function (CurrentState) {
    CurrentState["NotStarted"] = "NOT_STARTED";
    CurrentState["Ended"] = "ENDED";
    CurrentState["LeaderBoard"] = "LEADERBOARD";
    CurrentState["Question"] = "QUESTION";
})(CurrentState || (CurrentState = {}));
export class Quiz {
    hasStarted;
    roomId;
    problems;
    activeProblem;
    users;
    currentState;
    constructor(roomId) {
        this.hasStarted = false;
        this.roomId = roomId;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = CurrentState.NotStarted;
    }
    setActiveProblem(problem) {
        problem.startTime = new Date().getTime();
        problem.submission = [];
        IoManager.getInstance().emit("Next_Problem", {
            problem
        });
        setTimeout(() => {
            this.sendLeaderBoard();
        }, PROBLEM_TIME * 1000);
    }
    sendLeaderBoard() {
        const leaderBoard = this.getLeaderBoard().splice(0, 20);
        IoManager.getInstance().to(this.roomId).emit("LeaderBoard", {
            leaderBoard
        });
    }
    addProblem(problem) {
        this.problems.push(problem);
    }
    getLeaderBoard() {
        return this.users.sort((a, b) => a.points < b.points ? -1 : 1).slice(0, 20);
    }
    start() {
        this.hasStarted = true;
        const problem = this.problems[0];
        if (!problem) {
            return;
        }
        this.setActiveProblem(problem);
    }
    next(roomId) {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        const io = IoManager.getInstance();
        if (problem) {
            problem.startTime = new Date().getTime();
            io.emit("Next_Question", {
                problem: problem
            });
        }
        else {
            io.emit("Quiz_Ended", {
                problem: problem
            });
        }
    }
    generateString(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    addUser(name) {
        const userId = this.generateString(7);
        this.users.push({
            id: userId,
            name,
            points: 0
        });
        return userId;
    }
    submit(userId, roomId, problemId, submission) {
        const problem = this.problems.find(x => x.id === problemId);
        const user = this.users.find(x => x.id === userId);
        if (!problem || !user) {
            console.log("problem or user not found");
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
        });
        user.points += 1000 * (new Date().getTime() - problem.startTime) / (PROBLEM_TIME * 500);
    }
    getCurrentState() {
        if (this.currentState === CurrentState.NotStarted) {
            return {
                type: CurrentState.NotStarted
            };
        }
        if (this.currentState === CurrentState.Ended) {
            return {
                type: CurrentState.Ended
            };
        }
        if (this.currentState === CurrentState.LeaderBoard) {
            const leaderBoard = this.getLeaderBoard();
            return {
                type: CurrentState.LeaderBoard,
                leaderBoard
            };
        }
        if (this.currentState === CurrentState.Question) {
            const question = this.problems[this.activeProblem];
            return {
                type: CurrentState.Question,
                question
            };
        }
    }
}
//# sourceMappingURL=quiz.js.map