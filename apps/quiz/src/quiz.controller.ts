import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { QuizService } from './quiz.service';
import { CreateQuizDTO } from '@app/common/dto/createQuiz.dto';
import { addOptionDTO, addQuestionDTO, submitAnswerDTO } from '@app/common';

@Controller()
export class QuizController {

	constructor (
		private readonly quizService: QuizService
	) {}
  
  	@EventPattern('echo')
	echo (@Payload() data: any) {
  		return this.quizService.echo();
  	}

	@MessagePattern({ cmd: 'create-quiz' })
	createQuiz(@Payload() data: {data: CreateQuizDTO, authorId: string}) {
		return this.quizService.createQuiz(data);
	}

	@MessagePattern({ cmd: 'fetch-quizzes' })
	fetchQuizzes() {
		return this.quizService.fetchQuizzes();
	}

	@MessagePattern({ cmd: 'fetch-quiz-by-id' })
	fetchQuizById(data: { id: string, userId: string }) {
		return this.quizService.fetchQuizById(data.id, data.userId);
	}

	@MessagePattern({ cmd: 'view-quiz' })
	viewQuiz(data: { id: string }) {
		return this.quizService.viewQuiz(data.id);
	}

	@MessagePattern({ cmd: 'delete-quiz' })
	deleteQuiz(data: { id: string, authorId: string }) {
		return this.quizService.deleteQuiz(data.id, data.authorId);
	}

	@MessagePattern({ cmd: 'add-question' })
	addQuestion(data: { data: addQuestionDTO, authorId: string, quizId: string }) {
		return this.quizService.addQuestion(data.quizId, data.data, data.authorId);
	}

	@MessagePattern({ cmd: 'remove-question' })
	removeQuestion(data: { questionId: string, authorId: string }) {
		return this.quizService.removeQuestion(data.questionId, data.authorId);
	}

	@MessagePattern({ cmd: 'add-option' })
	addOption(data: { data: addOptionDTO, authorId: string, questionId: string }) {
		return this.quizService.addOption(data.questionId, data.data, data.authorId);
	}

	@MessagePattern({ cmd: 'remove-option'})
	removeOption(data: { optionId: string, authorId: string }) {
		return this.quizService.removeOption(data.optionId, data.authorId);
	}

	@MessagePattern({ cmd: 'publish-quiz'})
	publishQuiz(data: {id: string, authorId: string}) {
		return this.quizService.publishQuiz(data.id, data.authorId);
	}

	@MessagePattern({ cmd: 'unpublish-quiz'})
	unpublishQuiz(data: {id: string, authorId: string}) {
		return this.quizService.unpublishQuiz(data.id, data.authorId);
	}

	@MessagePattern({ cmd: 'attempt-quiz'})
	attemptQuiz(data: {id: string, userId: string}) {
		return this.quizService.createAttempt(data.id, data.userId);
	}

	@MessagePattern({ cmd: 'submit-answer'})
	submitAnswer(data: {data: submitAnswerDTO, attemptId: string, questionId: string, userId: string}) {
		return this.quizService.submitAnswer(data.attemptId, data.questionId, data.data, data.userId);
	}

	@MessagePattern({ cmd: 'finish-attempt' })
	finishAttempt(data: { attemptId: string, userId: string }) {
		return this.quizService.finishAttempt(data.attemptId, data.userId);
	}

	@MessagePattern({ cmd: 'view-attempt' })
	viewAttempt(data: { attemptId: string, userId: string }) {
		return this.quizService.viewAttempt(data.attemptId, data.userId);
	}

	@MessagePattern({ cmd: 'get-all-user-attempts' })
	getAllUserAttempts(data: { userId: string }) {
		return this.quizService.getAllUserAttempts(data.userId);
	}

	@MessagePattern({ cmd: 'get-all-unscored-attempts' })
	getAllUnscoredAttempts() {
		return this.quizService.getAllUnscoredAttempts();
	}

	@MessagePattern({ cmd: 'get-quiz-attempts' })
	getQuizAttempts(data: { quizId: string, userId: string }) {
		return this.quizService.getQuizAttempts(data.quizId, data.userId);
	}

	@MessagePattern({ cmd: 'score-answer' })
	scoreAnswer(data: { answerId: string, userId: string, score: number }) {
		return this.quizService.scoreAnswer(data.answerId, data.userId, data.score);
	}
}