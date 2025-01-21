import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'AUTHENTICATION_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [process.env.RABBITMQ_URL],
					queue: 'auth_queue',
				},
			},
			{
				name: 'NOTIFICATION_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: [process.env.RABBITMQ_URL],
					queue: 'notification_queue',
				},
			}
		]),
	],
	controllers: [AuthController],
	providers: [AuthService, ConfigService],
})
export class AuthModule {}
