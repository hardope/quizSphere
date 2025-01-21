import { NestFactory } from '@nestjs/core';
import { QuizModule } from './quiz.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		QuizModule,
		{
			transport: Transport.RMQ,
			options: {
			urls: [process.env.RABBITMQ_URL],
			queue: 'quiz_queue',
			},
		},
		);
	
	await app.listen();
}
bootstrap();
