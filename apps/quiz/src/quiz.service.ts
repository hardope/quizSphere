import { addOptionDTO, addQuestionDTO, PrismaService } from '@app/common';
import { CreateQuizDTO } from '@app/common/dto/createQuiz.dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QuizService {

	constructor (
		private readonly prisma: PrismaService
	) {}

	echo () {
		Logger.log('Echoing...', 'QuizService');
		return 'Echo!';
	}

	async createQuiz (data:{data: CreateQuizDTO, authorId: string}) {
		Logger.log('Creating quiz...', 'QuizService');
		try {
			return await this.prisma.quiz.create({
				data: {
					title: data.data.title,
					description: data.data.description,
					leaderboard: data.data.leaderboard,
					timeLimit: data.data.timeLimit,
					expire: data.data.expires,
					expiresAt: data.data.expiresAt,
					authorId: data.authorId
				}
			});
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'Failed to create quiz'
			}
		}
	}

	async fetchQuizzes () {
		Logger.log('Fetching quizzes...', 'QuizService');
		try {
			return await this.prisma.quiz.findMany();
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'Failed to fetch quizzes'
			}
		}
	}

	async fetchQuizById (id: string) {
		Logger.log('Fetching quiz by id...', 'QuizService');
		try {
			const quiz = await this.prisma.quiz.findUnique({
				where: { id }
			})

			if (!quiz) {
				return {
					error: 'not-found'
				}
			}

			const questions = await this.prisma.question.findMany({
				where: { quizId: id }
			});

			const questionsWithOptions = await Promise.all(questions.map(async (question) => {
				const options = await this.prisma.option.findMany({
					where: { questionId: question.id }
				});
				return {
					...question,
					options
				};
			}));

			return {
				...quiz,
				questions: questionsWithOptions
			};
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async deleteQuiz (id: string, authorId: string) {
		Logger.log('Deleting quiz...', 'QuizService');
		try {
			const quiz = await this.prisma.quiz.findUnique({
				where: { id }
			});

			if (!quiz) {
				return {
					error: 'not-found'
				};
			}

			if (quiz.authorId != authorId) {
				return {
					error: 'unauthorized'
				};
			}
			return await this.prisma.quiz.delete({
				where: { 
					id
				}
			})
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async addQuestion (quizId: string, data: addQuestionDTO, authorId: string) {
		Logger.log('Adding question...', 'QuizService');
		try {
			const quiz = await this.prisma.quiz.findUnique({
				where: { id: quizId }
			});

			if (!quiz) {
				return {
					error: 'not-found'
				};
			}

			if (quiz.authorId !== authorId) {
				return {
					error: 'unauthorized'
				}
			}

			if (quiz.published) {
				return {
					error: 'quiz-published'
				};
			}

			if (data.type === 'Boolean' && !data.booleanAnswer) {
				return {
					error: 'boolean-answer-required'
				};
			}

			return await this.prisma.question.create({
				data: {
					quizId,
					text: data.text,
					type: data.type,
					points: data.points,
					booleanAnswer: data.booleanAnswer || null
				}
			});
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async removeQuestion ( questionId, authorId) {
		Logger.log('Removing question...', 'QuizService');
		try {
			const question = await this.prisma.question.findUnique({
				where: { id: questionId }
			});

			const quiz = await this.prisma.quiz.findUnique({
				where: { id: question.quizId }
			});

			if (!question || !quiz) {
				return {
					error: 'not-found'
				};
			}

			if (quiz.authorId !== authorId) {
				return {
					error: 'unauthorized'
				};
			}

			if (quiz.published) {
				return {
					error: 'quiz-published'
				};
			}

			return await this.prisma.question.delete({
				where: { id: questionId }
			});
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async addOption (questionId: string, data: addOptionDTO, authorId: string) {
		Logger.log('Adding option...', 'QuizService');
		try {
			const question = await this.prisma.question.findUnique({
				where: { id: questionId }
			});

			const quiz = await this.prisma.quiz.findUnique({
				where: { id: question.quizId }
			});

			if (quiz.authorId !== authorId) {
				return {
					error: 'unauthorized'
				};
			}

			if (question.type == 'Boolean') {
				return {
					error: 'boolean-option'
				}
			}

			if (quiz.published) {
				return {
					error: 'quiz-published'
				};
			}

			return await this.prisma.option.create({
				data: {
					questionId,
					text: data.text,
					isCorrect: data.isCorrect
				}
			});
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async removeOption (optionId: string, authorId: string) {
		Logger.log('Removing option...', 'QuizService');
		try {
			const option = await this.prisma.option.findUnique({
				where: { id: optionId }
			});

			const question = await this.prisma.question.findUnique({
				where: { id: option.questionId }
			});

			const quiz = await this.prisma.quiz.findUnique({
				where: { id: question.quizId }
			});

			if (quiz.authorId !== authorId) {
				return {
					error: 'unauthorized'
				};
			}

			if (quiz.published) {
				return {
					error: 'quiz-published'
				};
			}

			return await this.prisma.option.delete({
				where: { id: optionId }
			});
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async publishQuiz(id: string, authorId: string) {
		Logger.log('Publishing quiz...', 'QuizService');
		try {
			const quiz = await this.prisma.quiz.findUnique({
				where: { id }
			});

			if (!quiz) {
				return {
					error: 'not-found'
				};
			}
			console.log('here')
			if (quiz.authorId !== authorId) {
				console.log('unauth')
				return {
					error: 'unauthorized'
				};
			}

			const questions = await this.prisma.question.findMany({
				where: { quizId: id }
			});

			if (questions.length === 0) {
				return {
					error: 'no-questions'
				};
			}

			for (const question of questions) {
				const options = await this.prisma.option.findMany({
					where: { questionId: question.id }
				});

				if (options.length < 2 && question.type !== 'Essay' && question.type !== 'Boolean') {
					return {
						error: {
							question: question.id,
							error: 'not-enough-options'
						}
					};
				}

				if (question.type === 'MultiChoice') {
					const correctOptions = options.filter(option => option.isCorrect);
					if (correctOptions.length === 0) {
						return {
							error: {
								question: question.id,
								error: 'no-correct-options'
							}
						};
					}
				}
			}

			return await this.prisma.quiz.update({
				where: { id },
				data: { published: true }
			});

		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

}
