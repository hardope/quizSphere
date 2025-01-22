import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { QuizService } from './quiz.service';
import { CreateQuizDTO } from '@app/common/dto/createQuiz.dto';

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

}