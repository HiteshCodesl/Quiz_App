import type { Quiz } from "../quiz.js";


export class QuizManager{
    private quizes: Quiz[];
   
    constructor(){
        this.quizes = [];
    }
}