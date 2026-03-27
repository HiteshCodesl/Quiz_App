

export class Quiz{
    private hasStarted: boolean;
    private roomId: string;

    constructor(roomId: string){
      this.hasStarted = false;
      this.roomId = roomId
    }

    startQuiz(roomId: string){
        this.hasStarted = true;
    }
}