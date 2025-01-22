import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateQuizDTO } from '@app/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('quiz')
@ApiTags('Quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@Get()
	fetchQuizzes() {
		return this.quizService.fetchQuizzes();
	}

	@Post()
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	createQuiz(@Body() data: CreateQuizDTO, @Req() req) {
		return this.quizService.createQuiz({ data, authorId: req.user.id });
	}

	@Get(':id')
	fetchQuizById(@Param('id') id: string) {
		return this.quizService.fetchQuizById(id);
	}

	@Delete(':id')
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	deleteQuiz(@Param('id') id: string, @Req() req) {
		return this.quizService.deleteQuiz(id, req.user.id);
	}

}
