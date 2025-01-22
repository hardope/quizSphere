import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateQuizDTO } from '@app/common';

@Injectable()
export class QuizService {
    constructor (
        @Inject('QUIZ_SERVICE') private readonly quizMicroService: ClientProxy
    ) {}

    echo () {
        this.quizMicroService.emit('echo', {})
    }

    async createQuiz (data: { data: CreateQuizDTO, authorId: string }) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'create-quiz' }, data).toPromise();
            if (res instanceof Error) {
                throw res;
            }
            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async fetchQuizzes () {
        try {
            const res = await this.quizMicroService.send({ cmd: 'fetch-quizzes' }, {}).toPromise();
            if (res instanceof Error) {
                throw res;
            }
            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async fetchQuizById (id: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'fetch-quiz-by-id' }, id).toPromise();
            console.log(res)
            if (!res) {
                throw new NotFoundException('Quiz not found');
            }
            return res;
        } catch (error) {
            throw error
        }
    }

    async deleteQuiz (id: string, authorId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'delete-quiz' }, { id, authorId }).toPromise();
            
            if (!res) {
                throw new BadRequestException('Unable to delete quiz');
            }
            return res;
        } catch (error) {
            throw error
        }
    }
}
