import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { PrismaService } from '@app/common';

@Module({
  imports: [],
  controllers: [QuizController],
  providers: [QuizService, PrismaService],
})
export class QuizModule {}
