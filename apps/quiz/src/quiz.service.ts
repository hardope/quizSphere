import { addOptionDTO, addQuestionDTO, PrismaService, submitAnswerDTO } from '@app/common';
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
			const quizes = await this.prisma.quiz.findMany();
			const quizzesWithQuestionCount = await Promise.all(quizes.map(async (quiz) => {
				const questionCount = await this.prisma.question.count({
					where: { quizId: quiz.id }
				});
				return {
					...quiz,
					questionCount
				};
			}));
			return quizzesWithQuestionCount;
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'Failed to fetch quizzes'
			}
		}
	}

	async fetchQuizById (id: string, userId: string) {
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

			if (quiz.authorId !== userId) {
				return {
					error: 'unauthorized'
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

	async viewQuiz (id: string) {
		try {
			const quiz = await this.prisma.quiz.findUnique({
				where: { id }
			});

			if (!quiz) {
				return {
					error: 'not-found'
				};
			}

			if (quiz.published === false) {
				return {
					error: 'quiz-not-published'
				};
			}

			const questions = await this.prisma.question.findMany({
				where: { quizId: id }
			});

			return {
				...quiz,
				totalQuestions: questions.length
			}
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async displayQuiz(quizId: string, userId: string) {
		try {
			const quiz = await this.viewQuiz(quizId);

			if (quiz.error) {
				return quiz;
			}

			const attempt = await this.prisma.attempt.findFirst({
				where: {
					quizId,
					userId
				}
			});
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

	async unpublishQuiz(id: string, authorId: string) {
		Logger.log('Unpublishing quiz...', 'QuizService');
		try {
			const quiz = await this.prisma.quiz.findUnique({
				where: { id }
			});

			if (!quiz) {
				return {
					error: 'not-found'
				};
			}

			if (quiz.authorId !== authorId) {
				return {
					error: 'unauthorized'
				};
			}

			return await this.prisma.quiz.update({
				where: { id },
				data: { published: false }
			});
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async createAttempt (quizId: string, userId: string) {
		Logger.log('Creating attempt...', 'QuizService');
		try {
			const quiz = await this.prisma.quiz.findUnique({
				where: { id: quizId }
			});

			if (!quiz) {
				console.log("Quiz not found")
				return {
					error: 'not-found'
				};
			}

			if (userId === quiz.authorId) {
				console.log("User created quiz cannot attempt")
				return {
					error: 'failed'
				}
			}

			if (quiz.published === false) {
				console.log("quiz not published")
				return {
					error: 'quiz-not-published'
				};
			}

			const attempt = await this.prisma.attempt.findFirst({
				where: {
					quizId,
					userId
				}
			});

			if (attempt) {
				console.log("Found Existing attempt")
				const newDate = new Date()
				const end =  new Date(attempt?.startTime?.getTime() + quiz.timeLimit * 1000)
				console.log(end, attempt.startTime)

				if (newDate > end) {
					console.log("Time up")
					return {
						error: 'time-up'
					};
				}

				const quizQuestions = await this.prisma.question.findMany({
					where: { quizId },
					select: {
						id: true,
						text: true,
						type: true,
						points: true,
					}
				});
	
				const quizQuestionsWithOptions = await Promise.all(quizQuestions.map(async (question) => {
					const options = await this.prisma.option.findMany({
						where: { questionId: question.id },
						select: {
							id: true,
							text: true,
						}
					});
					const answer = await this.prisma.answer.findFirst({
						where: {
							userId,
							questionId: question.id
						},
						select: {
							optionId: true,
							optionIds: true,
							booleanAnswer: true,
							textAnswer: true
						}
					});
					
					return {
						...question,
						options,
						answer
					};
					})
				)
				console.log("returning old attempt")
				return {
					attemptId: attempt.id,
					...quiz,
					questions: quizQuestionsWithOptions,
				};
			}
			console.log("creating new attempt")
			const newAttempt = await this.prisma.attempt.create({
				data: {
					quizId,
					userId
				}
			});

			const questions = await this.prisma.question.findMany({
				where: { quizId },
				select: {
					id: true,
					text: true,
					type: true,
					points: true,
				}
			});

			const questionsWithOptions = await Promise.all(questions.map(async (question) => {
				const options = await this.prisma.option.findMany({
					where: { questionId: question.id },
					select: {
						id: true,
						text: true,
					}
				});
				return {
					...question,
					options
				};
				})
			)

			console.log("returning new attempt")
			return {
				...quiz,
				questions: questionsWithOptions,
				totalQuestions: questions.length,
				attemptId: newAttempt.id
			};
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async viewAttempt(attemptId: string, userId: string) {
		Logger.log('Viewing attempt...', 'QuizService');
		try {
			const attempt = await this.prisma.attempt.findUnique({
				where: { id: attemptId }
			});

			if (!attempt) {
				return {
					error: 'not-found'
				};
			}

			if (attempt.userId !== userId) {
				return {
					error: 'unauthorized'
				};
			}

			const quiz = await this.prisma.quiz.findUnique({
				where: { id: attempt.quizId }
			});

			if (!quiz) {
				return {
					error: 'quiz-not-found'
				};
			}

			const questions = await this.prisma.question.findMany({
				where: { quizId: quiz.id },
				select: {
					id: true,
					text: true,
					type: true,
					points: true,
				}
			});

			const questionsWithOptions = await Promise.all(questions.map(async (question) => {
				const options = await this.prisma.option.findMany({
					where: { questionId: question.id },
					select: {
						id: true,
						text: true,
					}
				});
				const answer = await this.prisma.answer.findFirst({
					where: {
						userId,
						attemptId,
						questionId: question.id
					},
					select: {
						optionId: true,
						optionIds: true,
						booleanAnswer: true,
						textAnswer: true,
						score: true
					}
				});
				return {
					...question,
					options,
					answer
				};
			}));

			if (attempt.isScored) {
				return {
					...quiz,
					questions: questionsWithOptions,
					score: attempt.score
				};
			}

			const manualScoringNeeded = await this.checkIfManualScoringNeeded(attemptId);

			if (manualScoringNeeded) {
				return {
					...quiz,
					questions: questionsWithOptions,
					score: null
				};
			}

			await this.scoreQuiz(attemptId);

			const updatedAttempt = await this.prisma.attempt.findUnique({
				where: { id: attemptId }
			});

			return {
				...quiz,
				questions: questionsWithOptions,
				score: updatedAttempt.score
			};

		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async submitAnswer (attemptId: string, questionId: string, data: submitAnswerDTO, userId: string) {
		try {
			const question = await this.prisma.question.findUnique({
				where: { id: questionId }
			});

			if (!question) {
				return {
					error: 'question-not-found'
				};
			}

			const quiz = await this.prisma.quiz.findUnique({
				where: { id: question.quizId }
			});

			const attempt = await this.prisma.attempt.findUnique({
				where: { id: attemptId }
			});

			if (!attempt) {
				return {
					error: 'attempt-not-found'
				};
			}

			if (attempt.userId !== userId) {
				return {
					error: 'unauthorized'
				};
			}
			const newDate = new Date()
			const end =  new Date(attempt.startTime.getTime() + quiz.timeLimit * 1000)

			if (newDate > end) {
				return {
					error: 'time-up'
				};
			}

			if (attempt.completed) {
				return {
					error: 'quiz-completed'
				}
			}

			if (question.quizId !== attempt.quizId) {
				return {
					error: 'question-not-in-quiz'
				};
			}

			if (data.textAnswer && question.type !== 'Essay') {
				return {
					error: 'text-answer-not-allowed'
				};
			}
			
			if ((data.optionId && question.type !== 'MultiChoice') || (data.optionIds && question.type !== 'MultiChoice')) {
				return {
					error: 'option-answer-not-allowed'
				};
			}

			if (data.booleanAnswer && question.type !== 'Boolean') {
				return {
					error: 'boolean-answer-not-allowed'
				};
			}

			const currentAnswer = await this.prisma.answer.findFirst({
				where: {
					userId,
					attemptId,
					questionId
				}
			});

			if (currentAnswer) {
				await this.prisma.answer.delete({
					where: { id: currentAnswer.id }
				});
			}			
			
			if (question.type === 'MultiChoice' && data.optionId) {
				const option = await this.prisma.option.findUnique({
					where: {
						id: data.optionId,
						questionId
					}
				});

				if (!option) {
					return {
						error: 'option-not-found'
					};
				}

				const answer = await this.prisma.answer.create({
					data: {
						userId,
						attemptId,
						questionId,
						optionId: data.optionId
					}
				});
			} else if (question.type === 'MultiChoice' && data.optionIds) {
				const options = await this.prisma.option.findMany({
					where: {
						id: {
							in: data.optionIds
						},
						questionId
					}
				});

				if (options.length !== data.optionIds.length) {
					return {
						error: 'option-not-found'
					};
				}

				const answer = await this.prisma.answer.create({
					data: {
						userId,
						attemptId,
						questionId,
						optionIds: data.optionIds
					}
				});
			} else if (question.type === 'Boolean') {
				
				const answer = await this.prisma.answer.create({
					data: {
						userId,
						attemptId,
						questionId,
						booleanAnswer: data.booleanAnswer
					}
				});

				console.log(answer)

			} else {
				const answer = await this.prisma.answer.create({
					data: {
						userId,
						attemptId,
						questionId,
						textAnswer: data.textAnswer
					}
				});

				console.log(answer)
			}

			return {
				submitted: true
			};
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async finishAttempt (attemptId: string, userId: string) {
		try {
			const attempt = await this.prisma.attempt.findUnique({
				where: { id: attemptId }
			});

			if (!attempt) {
				return {
					error: 'not-found'
				};
			}

			if (attempt.userId !== userId) {
				return {
					error: 'unauthorized'
				};
			}

			await this.prisma.attempt.update({
				where: { id: attemptId },
				data: {
					completed: true
				}
			});

			const isManualScoreNeeded = await this.checkIfManualScoringNeeded(attemptId);

			if (!isManualScoreNeeded) {
				this.scoreQuiz(attemptId)
			}

			return {
				completed: true
			};

		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async getAllUserAttempts (userId: string) {
		try {
			const attempts = await this.prisma.attempt.findMany({
				where: { userId }
			});

			return attempts;
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async getAllUnscoredAttempts () {
		try {
			const attempts = await this.prisma.attempt.findMany({
				where: { isScored: false }
			});

			return attempts;
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async getQuizAttempts (quizId: string, userId: string) {
		try {
			const attempts = await this.prisma.attempt.findMany({
				where: {
					quizId,
					userId
				}
			});

			const answers = await Promise.all(attempts.map(async (attempt) => {
				const answers = await this.prisma.answer.findMany({
					where: {
						userId,
						attemptId: attempt.id
					}
				});
				return {
					...attempt,
					answers
				};
			}));

			return answers;
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	async scoreAnswer (answerId: string, userId: string, score: number) {
		Logger.log('Scoring answer...', 'QuizService');
		try {
			const answer = await this.prisma.answer.findUnique({
				where: { id: answerId }
			});

			if (!answer) {
				return {
					error: 'answer-not-found'
				};
			}

			const question = await this.prisma.question.findUnique({
				where: { id: answer.questionId }
			});

			if (!question) {
				return {
					error: 'question-not-found'
				};
			}

			const quiz = await this.prisma.quiz.findUnique({
				where: { id: question.quizId }
			});

			if (!quiz) {
				return {
					error: 'quiz-not-found'
				};
			}

			if (quiz.authorId !== userId) {
				return {
					error: 'unauthorized'
				};
			}

			if (question.type !== 'Essay') {
				return {
					error: 'not-essay-question'
				};
			}

			if (score > question.points) {
				return {
					error: 'score-too-high'
				};
			}

			const manualScoring = await this.checkIfManualScoringNeeded(answer.attemptId);

			if (!manualScoring) {
				return {
					error: 'manual-scoring-not-needed'
				};
			}

			await this.prisma.answer.update({
				where: { id: answerId },
				data: {
					score: score
				}
			});

			if (!await this.checkIfManualScoringNeeded(answer.attemptId)) {
				this.scoreQuiz(answer.attemptId);
			}

			return {
				scored: true
			};
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	private async scoreQuiz (attemptId: string) {
		Logger.log('Scoring quiz...', 'QuizService');
		try {
			const attempt = await this.prisma.attempt.findUnique({
				where: { id: attemptId }
			});

			if (!attempt) {
				return {
					error: 'attempt-not-found'
				};
			}

			const answers = await this.prisma.answer.findMany({
				where: { attemptId }
			});

			let totalScore = 0;
			let allScored = true;

			for (const answer of answers) {
				const question = await this.prisma.question.findUnique({
					where: { id: answer.questionId }
				});

				if (!question) {
					continue;
				}

				if (question.type !== 'Essay') {
					let answerScore = 0;

					if (question.type === 'Boolean') {
						answerScore = answer.booleanAnswer === question.booleanAnswer ? question.points : 0;
					} else if (question.type === 'MultiChoice') {
						const correctOptions = await this.prisma.option.findMany({
							where: {
								questionId: question.id,
								isCorrect: true
							}
						});

						if (answer.optionId) {
							const isCorrect = correctOptions.some(option => option.id === answer.optionId);
							answerScore = isCorrect ? question.points : 0;
						} else if (answer.optionIds) {
							const correctOptionIds = correctOptions.map(option => option.id);
							const isCorrect = answer.optionIds.every(id => correctOptionIds.includes(id));
							answerScore = isCorrect ? question.points : 0;
						}
					}

					totalScore += answerScore;

					await this.prisma.answer.update({
						where: { id: answer.id },
						data: { score: answerScore }
					});
				} else {
					if (answer.score === null) {
						allScored = false;
					}
				}
			}

			await this.prisma.attempt.update({
				where: { id: attemptId },
				data: {
					score: totalScore,
					isScored: allScored
				}
			});

			return {
				scored: true
			};
		} catch (error) {
			Logger.error(error, 'QuizService');
			return {
				error: 'failed'
			};
		}
	}

	private async checkIfManualScoringNeeded(attemptId: string) {
		Logger.log('Checking if manual scoring needed...', 'QuizService');
		try {
			const answers = await this.prisma.answer.findMany({
				where: {
					attemptId,
					score: null,
					optionId: null,
					optionIds: null,
					booleanAnswer: null,
				},
			});

			return answers.length > 0;
		} catch (error) {
			Logger.error(error, 'QuizService');
			return false;
		}
	}

}