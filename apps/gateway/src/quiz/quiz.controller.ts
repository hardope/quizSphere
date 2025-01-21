import { Controller, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('quiz')
@ApiTags('Quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@Get()
	echo() {
		this.quizService.echo()
	}
}
