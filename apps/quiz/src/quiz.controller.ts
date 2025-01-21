import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { QuizService } from './quiz.service';

@Controller()
export class QuizController {

	constructor (
		private readonly quizService: QuizService
	) {}
  
  	@EventPattern('echo')
	echo (@Payload() data: any) {
  		return this.quizService.echo();
  	}

}