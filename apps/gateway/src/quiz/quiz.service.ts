import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { addOptionDTO, addQuestionDTO, CreateQuizDTO } from '@app/common';
// import { error } from 'console';

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
            if (res.error) {
                return new BadRequestException(res.error.response);
            }
            return res;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async fetchQuizzes () {
        try {
            const res = await this.quizMicroService.send({ cmd: 'fetch-quizzes' }, {}).toPromise();
            if (res.error) {
                throw new BadRequestException(res.error);
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async fetchQuizById (id: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'fetch-quiz-by-id' }, id).toPromise();

            if (res.error) {
                if (res.error == 'not-found') {
                    throw new NotFoundException('Quiz not found');
                } else {
                    throw new BadRequestException(res.error);
                }
            }
            return res;
        } catch (error) {
            throw error
        }
    }

    async deleteQuiz (id: string, authorId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'delete-quiz' }, { id, authorId }).toPromise();
            
            if (res.error) {
                if (res.error === 'not-found') {
                    throw new NotFoundException('Quiz not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else {
                    throw new BadRequestException("Unable to delete quiz");
                }
            }

            return res;
        } catch (error) {
            throw error
        }
    }

    async addQuestion (quizId: string, data: addQuestionDTO, authorId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'add-question' }, { data, authorId, quizId }).toPromise();

            if (res.error) {
                if (res.error === 'not-found') {
                    throw new NotFoundException('Quiz not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else if (res.error === 'boolean-answer-required') {
                    throw new BadRequestException('Boolean answer required');
                } else {
                    throw new BadRequestException('Unable to add question');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async removeQuestion (questionId: string, authorId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'remove-question' }, { questionId, authorId }).toPromise();

            if (res.error) {
                if (res.error === 'not-found') {
                    throw new NotFoundException('Quiz || Question not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else {
                    throw new BadRequestException('Unable to remove question');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async addOption (questionId: string, data: addOptionDTO, authorId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'add-option' }, { data, authorId, questionId }).toPromise();

            if (res.error) {
                if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else if (res.error === 'boolean-option') {
                    throw new BadRequestException('Boolean option not allowed');
                } else if (res.error === 'quiz-published') {
                    throw new BadRequestException('Quiz is published');
                } else {
                    throw new BadRequestException('Unable to add option');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async removeOption (optionId: string, authorId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'remove-option' }, { optionId, authorId }).toPromise();

            if (res.error) {
                if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else if (res.error === 'quiz-published') {
                    throw new BadRequestException('Quiz is published');
                } else {
                    throw new BadRequestException('Unable to remove option');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async publishQuiz (id: string, authorId: string) {
        console.log('Publishing quiz...')
        try {
            const res = await this.quizMicroService.send({ cmd: 'publish-quiz' }, { id, authorId }).toPromise();

            if (res.error) {
                console.log(res.error)
                if (res.error === 'not-found') {
                    throw new NotFoundException('Quiz not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('You are not Unauthorized to perform this action');
                } else if (res.error === 'no-questions') {
                    throw new BadRequestException('Quiz has no questions');
                } else if (res.error.error === 'not-enough-options') {
                    throw new BadRequestException(`Not enough options for question: ${res.error.question}`);
                } else if (res.error.error == 'no-correct-options') {
                    throw new BadRequestException(`No correct options for question: ${res.error.question}`);
                } else {
                    throw new BadRequestException('Unable to publish quiz');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }
}
