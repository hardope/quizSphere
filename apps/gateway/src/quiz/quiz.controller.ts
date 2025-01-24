import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { addOptionDTO, addQuestionDTO, CreateQuizDTO } from '@app/common';
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
	@ApiOperation({ summary: 'Fetch quiz by id' })
	fetchQuizById(@Param('id') id: string) {
		return this.quizService.fetchQuizById(id);
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

	@Post(':id/question/:questionId/option')
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

}
