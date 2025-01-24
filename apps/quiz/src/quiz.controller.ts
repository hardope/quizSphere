import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { QuizService } from './quiz.service';
import { CreateQuizDTO } from '@app/common/dto/createQuiz.dto';
import { addOptionDTO, addQuestionDTO } from '@app/common';

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
	fetchQuizById(id: string) {
		return this.quizService.fetchQuizById(id);
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
}