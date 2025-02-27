import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { addOptionDTO, addQuestionDTO, CreateQuizDTO, submitAnswerDTO } from '@app/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { UpdateQuizDTO } from '@app/common/dto/updateQuiz.dto';

@Controller('quiz')
@ApiTags('Quiz')
export class QuizController {
	constructor(private readonly quizService: QuizService) {}

	@Get()
	@ApiOperation({ summary: 'Fetch all quizzes with pagination and category filter' })
	fetchQuizzes(@Query('page') page: number = 1, @Query('limit') limit: number = 10, @Query('category') category: string = "") {
		return this.quizService.fetchQuizzes({ page, limit, category });
	}

	@Get('user')
	@ApiOperation({ summary: 'Fetch all created quizzes for user' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	fetchUserQuizzes(@Req() req) {
		return this.quizService.fetchUserQuizzes(req.user.id);
	}

	@Get('dashboard')
	@ApiOperation({ summary: 'Get dashboard for user'})
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	getDashboard(@Req() req) {
		return this.quizService.dashboard(req.user.id);
	}

	@Get('get-user-attempt')
	@ApiOperation({ summary: 'Get all attempts by a user' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	getAllUserAttempts(@Req() req) {
		return this.quizService.getAllUserAttempts(req.user.id);
	}

	@Post()
	@ApiOperation({ summary: 'Create a quiz' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	createQuiz(@Body() data: CreateQuizDTO, @Req() req) {
		return this.quizService.createQuiz({ data, authorId: req.user.id });
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update quiz'})
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	updateQuiz(@Param('id') id: string, @Body() data: UpdateQuizDTO, @Req() req) {
		return this.quizService.updateQuiz({ data, authorId: req.user.id, quizId: id });
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

	@Patch('question/:questionId')
	@ApiOperation({ summary: 'Edit question in quiz' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	editQuestion(@Param('questionId') questionId: string, @Body() data: addQuestionDTO, @Req() req) {
		return this.quizService.editQuestion(questionId, data, req.user.id);
	}

	@Delete('question/:questionId')
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

	@Patch('question/option/:optionId')
	@ApiOperation({ summary: 'Edit option in question' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	editOption(@Param('optionId') optionId: string, @Body() data: addOptionDTO, @Req() req) {
		return this.quizService.editOption(optionId, data, req.user.id);
	}

	@Delete('question/option/:optionId')
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

	@Patch('/submit/:attemptId/:questionId')
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

	@Get(':id/unscored/attempts')
	@ApiOperation({ summary: 'Get all unscored attempts' })
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	getAllUnscoredAttempts(@Param('id') id: string, @Req() req) {
		return this.quizService.getAllUnscoredAttemptsForQuiz(id, req.user.id);
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

	// @Patch('answer/:answerId/score')
	// @ApiOperation({ summary: 'Score an answer' })
	// @UseGuards(JwtGuard)
	// @ApiBearerAuth()
	// scoreAnswer(@Param('answerId') answerId: string, @Body('score') score: number, @Req() req) {
	// 	return this.quizService.scoreAnswer(answerId, req.user.id, score);
	// }
}
