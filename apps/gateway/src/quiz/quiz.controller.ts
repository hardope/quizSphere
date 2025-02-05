import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { addOptionDTO, addQuestionDTO, CreateQuizDTO, submitAnswerDTO } from '@app/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';

@Controller('quiz')
@ApiTags('Quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@Get()
	@ApiOperation({ summary: 'Fetch all quizzes' })
	fetchQuizzes() {
		return this.quizService.fetchQuizzes();
	}

	@Post()
	@ApiOperation({ summary: 'Create a quiz' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	createQuiz(@Body() data: CreateQuizDTO, @Req() req) {
		return this.quizService.createQuiz({ data, authorId: req.user.id });
	}

	@Get(':id')
	@ApiOperation({ summary: 'Fetch quiz by id - for quiz Owner' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	fetchQuizById(@Param('id') id: string, @Req() req) {
		return this.quizService.fetchQuizById(id, req.user.id);
	}

	@Get(':id/view')
	@ApiOperation({ summary: 'View quiz by id - for quiz taker' })
	viewQuiz(@Param('id') id: string) {
		return this.quizService.viewQuiz(id);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete quiz by id' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	deleteQuiz(@Param('id') id: string, @Req() req) {
		return this.quizService.deleteQuiz(id, req.user.id);
	}

	@Post(':id/question')
	@ApiOperation({ summary: 'Add question to quiz' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	addQuestion(@Param('id') id: string, @Body() data: addQuestionDTO, @Req() req) {
		return this.quizService.addQuestion(id, data, req.user.id);
	}

	@Delete(':id/question/:questionId')
	@ApiOperation({ summary: 'Remove question from quiz' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	removeQuestion(@Param('questionId') questionId: string, @Req() req) {
		return this.quizService.removeQuestion(questionId, req.user.id);
	}

	@Post('question/:questionId/option')
	@ApiOperation({ summary: 'Add option to question' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	addOption(@Param('questionId') questionId: string, @Body() data: addOptionDTO, @Req() req) {
		return this.quizService.addOption(questionId, data, req.user.id);
	}

	@Delete(':id/question/:questionId/option/:optionId')
	@ApiOperation({ summary: 'Remove option from question' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	removeOption(@Param('optionId') optionId: string, @Req() req) {
		return this.quizService.removeOption(optionId, req.user.id);
	}

	@Post(':id/publish')
	@ApiOperation({ summary: 'Publish quiz' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	publishQuiz(@Param('id') id: string, @Req() req) {
		return this.quizService.publishQuiz(id, req.user.id);
	}

	@Post(':id/unpublish')
	@ApiOperation({ summary: 'Unpublish quiz' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	unpublishQuiz(@Param('id') id: string, @Req() req) {
		return this.quizService.unpublishQuiz(id, req.user.id);
	}

	@Patch(':id/attempt')
	@ApiOperation({ summary: 'Attempt quiz' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	attemptQuiz(@Param('id') id: string, @Req() req) {
		return this.quizService.attemptQuiz(id, req.user.id);
	}

	@Patch(':id/submit/:attemptId/:questionId')
	@ApiOperation({ summary: 'Submit answer to question' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	submitAnswer(@Param('attemptId') attemptId: string, @Param('questionId') questionId: string, @Body() data: submitAnswerDTO, @Req() req) {
		return this.quizService.submitAnswer(attemptId, questionId, data, req.user.id);
	}

	@Get(':id/attempts')
	@ApiOperation({ summary: 'Get all attempts for a quiz' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	getQuizAttempts(@Param('id') id: string, @Req() req) {
		return this.quizService.getQuizAttempts(id, req.user.id);
	}

	@Get('user/attempts')
	@ApiOperation({ summary: 'Get all attempts by a user' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	getAllUserAttempts(@Req() req) {
		return this.quizService.getAllUserAttempts(req.user.id);
	}

	@Get('unscored/attempts')
	@ApiOperation({ summary: 'Get all unscored attempts' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	getAllUnscoredAttempts() {
		return this.quizService.getAllUnscoredAttempts();
	}

	@Get('attempt/:attemptId')
	@ApiOperation({ summary: 'View attempt by id' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	viewAttempt(@Param('attemptId') attemptId: string, @Req() req) {
		return this.quizService.viewAttempt(attemptId, req.user.id);
	}

	@Patch('attempt/:attemptId/finish')
	@ApiOperation({ summary: 'Finish an attempt' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	finishAttempt(@Param('attemptId') attemptId: string, @Req() req) {
		return this.quizService.finishAttempt(attemptId, req.user.id);
	}

	@Patch('answer/:answerId/score')
	@ApiOperation({ summary: 'Score an answer' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	scoreAnswer(@Param('answerId') answerId: string, @Body('score') score: number, @Req() req) {
		return this.quizService.scoreAnswer(answerId, req.user.id, score);
	}
}
