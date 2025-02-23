import { BadRequestException, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { addOptionDTO, addQuestionDTO, CreateQuizDTO, submitAnswerDTO } from '@app/common';
import { UpdateQuizDTO } from '@app/common/dto/updateQuiz.dto';
// import { error } from 'console';

@Injectable()
export class QuizService {
    constructor (
        @Inject('QUIZ_SERVICE') private readonly quizMicroService: ClientProxy
    ) {}

    echo () {
        this.quizMicroService.emit('echo', {})
    }

    async dashboard (userId) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'dashboard' }, { userId }).toPromise();
            if (res.error) {
                throw new BadRequestException(res.error);
            }
            return res;
        } catch (error) {
            throw error;
        }
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

    async updateQuiz (data: {data: UpdateQuizDTO, authorId: string, quizId: string}) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'update-quiz'}, data).toPromise()

            if (!res?.error) {
                return res
            }

            if (res.error === 'not-found') {
                throw new NotFoundException('Quiz Not Found')
            } else if (res.error === 'unauthorized') {
                throw new UnauthorizedException('You are not authorized to perform this action')
            } else if (res.error === 'quiz-published') {
                throw new BadRequestException('Quiz is already published')
            }

            throw new BadRequestException('Failed to update Quiz')
        } catch (error) {
            Logger.log(error.message, 'quizService')
            throw new BadRequestException('failed')
        }
    }

    async fetchQuizzes (data: { page: number, limit: number, category?: string }) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'fetch-quizzes' }, { page:data.page, limit:data.limit, category:data.category }).toPromise();
            if (res.error) {
                throw new BadRequestException(res.error);
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async fetchUserQuizzes (userId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'fetch-user-quizzes' }, { userId }).toPromise();
            if (res.error) {
                throw new BadRequestException(res.error);
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async viewQuiz (id: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'view-quiz' }, { id }).toPromise();
            if (res.error) {
                if (res.error === 'not-found') {
                    throw new NotFoundException('Quiz not found');
                } else {
                    throw new BadRequestException('Unable to view quiz');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async fetchQuizById (id: string, userId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'fetch-quiz-by-id' }, {id, userId}).toPromise();

            if (res.error) {
                if (res.error == 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else if (res.error == 'not-found') {
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
                if (res.error === 'quiz-published') {
                    throw new BadRequestException('Quiz is published');
                } else if (res.error === 'not-found') {
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

    async editQuestion (questionId: string, data: addQuestionDTO, authorId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'edit-question' }, { data, authorId, questionId }).toPromise();

            if (res.error) {
                if (res.error === 'not-found') {
                    throw new NotFoundException('Question not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else {
                    throw new BadRequestException('Unable to edit question');
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

    async editOption (optionId: string, data: addOptionDTO, authorId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'edit-option' }, { data, authorId, optionId }).toPromise();

            if (res.error) {
                if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else {
                    throw new BadRequestException('Unable to edit option');
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

    async unpublishQuiz (id: string, authorId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'unpublish-quiz' }, { id, authorId }).toPromise();

            if (res.error) {
                if (res.error === 'not-found') {
                    throw new NotFoundException('Quiz not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('You are Unauthorized to perform this action');
                } else {
                    throw new BadRequestException('Unable to unpublish quiz');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async attemptQuiz (id: string, userId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'attempt-quiz' }, { id, userId }).toPromise();

            if (res.error) {
                if (res.error === 'quiz-not-published') {
                    throw new BadRequestException('Quiz not published');
                } else if (res.error === 'not-found') {
                    throw new NotFoundException('Quiz not found');
                } else {
                    throw new BadRequestException('Unable to attempt quiz');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async submitAnswer(attemptId: string, questionId: string, data: submitAnswerDTO, userId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'submit-answer' }, { attemptId, questionId, data, userId }).toPromise();

            if (res.error) {
                if (res.error === 'question-not-found') {
                    throw new NotFoundException('Question not found');
                } else if (res.error === 'attempt-not-found') {
                    throw new NotFoundException('Attempt not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else if (res.error === 'time-up') {
                    throw new BadRequestException('Time is up');
                } else if (res.error === 'question-not-in-quiz') {
                    throw new BadRequestException('Question not in quiz');
                } else if (res.error === 'text-answer-not-allowed') {
                    throw new BadRequestException('Text answer not allowed');
                } else if (res.error === 'option-answer-not-allowed') {
                    throw new BadRequestException('Option answer not allowed');
                } else if (res.error === 'boolean-answer-not-allowed') {
                    throw new BadRequestException('Boolean answer not allowed');
                } else if (res.error === 'option-not-found') {
                    throw new NotFoundException('Option not found');
                } else {
                    throw new BadRequestException('Failed to submit answer');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async finishAttempt(attemptId: string, userId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'finish-attempt' }, { attemptId, userId }).toPromise();

            if (res.error) {
                if (res.error === 'not-found') {
                    throw new NotFoundException('Attempt not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else {
                    throw new BadRequestException('Unable to finish attempt');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async viewAttempt(attemptId: string, userId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'view-attempt' }, { attemptId, userId }).toPromise();

            if (res.error) {
                if (res.error === 'not-found') {
                    throw new NotFoundException('Attempt not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else {
                    throw new BadRequestException('Unable to view attempt');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async getAllUserAttempts(userId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'get-all-user-attempts' }, { userId }).toPromise();

            if (res.error) {
                throw new BadRequestException(res.error);
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async getAllUnscoredAttemptsForQuiz(quizId: string, userId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'get-all-unscored-attempts' }, {quizId, userId}).toPromise();

            if (res.error) {
                throw new BadRequestException(res.error);
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async getQuizAttempts(quizId: string, userId: string) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'get-quiz-attempts' }, { quizId, userId }).toPromise();

            if (res.error) {
                throw new BadRequestException(res.error);
            }
            return res;
        } catch (error) {
            throw error;
        }
    }

    async scoreAnswer(answerId: string, userId: string, score: number) {
        try {
            const res = await this.quizMicroService.send({ cmd: 'score-answer' }, { answerId, userId, score }).toPromise();

            if (res.error) {
                if (res.error === 'answer-not-found') {
                    throw new NotFoundException('Answer not found');
                } else if (res.error === 'question-not-found') {
                    throw new NotFoundException('Question not found');
                } else if (res.error === 'quiz-not-found') {
                    throw new NotFoundException('Quiz not found');
                } else if (res.error === 'unauthorized') {
                    throw new BadRequestException('Unauthorized');
                } else if (res.error === 'not-essay-question') {
                    throw new BadRequestException('Not an essay question');
                } else if (res.error === 'score-too-high') {
                    throw new BadRequestException('Score too high');
                } else if (res.error === 'manual-scoring-not-needed') {
                    throw new BadRequestException('Manual scoring not needed');
                } else {
                    throw new BadRequestException('Unable to score answer');
                }
            }
            return res;
        } catch (error) {
            throw error;
        }
    }
}
