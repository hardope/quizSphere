import { PrismaService } from '@app/common';
import { CreateQuizDTO } from '@app/common/dto/createQuiz.dto';
import { Injectable, Logger } from '@nestjs/common';

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
			return new Error('Failed to create quiz');
		}
	}

	async fetchQuizzes () {
		Logger.log('Fetching quizzes...', 'QuizService');
		try {
			return await this.prisma.quiz.findMany();
		} catch (error) {
			Logger.error(error, 'QuizService');
			return new Error('Failed to fetch quizzes');
		}
	}

	async fetchQuizById (id: string) {
		Logger.log('Fetching quiz by id...', 'QuizService');
		try {
			return await this.prisma.quiz.findUnique({
				where: { id }
			})
		} catch (error) {
			Logger.error(error, 'QuizService');
			return new Error('Failed to fetch quiz by id');
		}
	}

	async deleteQuiz (id: string, authorId: string) {
		Logger.log('Deleting quiz...', 'QuizService');
		try {
			return await this.prisma.quiz.delete({
				where: { 
					id,
					authorId
				}
			})
		} catch (error) {
			Logger.error(error, 'QuizService');
			return false;
		}
	}
}
