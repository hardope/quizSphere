import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AuthenticationModule,
		{
			transport: Transport.RMQ,
			options: {
				urls: [process.env.RABBITMQ_URL],
				queue: 'auth_queue',
			},
		},
	);

	app.listen();
}
bootstrap();
