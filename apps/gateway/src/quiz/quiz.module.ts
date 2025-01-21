import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'QUIZ_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [process.env.RABBITMQ_URL],
					queue: 'quiz_queue',
				},
			},
		])
	],
    controllers: [QuizController],
    providers: [QuizService],
})
export class QuizModule {}
