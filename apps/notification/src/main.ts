import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		NotificationModule,
		{
			transport: Transport.RMQ,
			options: {
			urls: [process.env.RABBITMQ_URL],
			queue: 'notification_queue',
			},
		},
		);
	
	await app.listen();
}
bootstrap();
