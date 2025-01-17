import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AuthenticationModule,
		{
			transport: Transport.RMQ,
			options: {
				urls: ['amqp://localhost:5672'],
				queue: 'auth_queue',
			},
		},
	);

	app.listen();
}
bootstrap();
