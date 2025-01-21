import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class QuizService {
    constructor (
        @Inject('QUIZ_SERVICE') private readonly quizMicroService: ClientProxy
    ) {}

    echo () {
        this.quizMicroService.emit('echo', {})
    }
}
