	import { Module } from '@nestjs/common';
	import { UsersService } from './users.service';
	import { UsersController } from './users.controller';
	import { ClientsModule, Transport } from '@nestjs/microservices';

	@Module({
		imports: [
			ClientsModule.register([
				{
					name: 'USER_SERVICE',
					transport: Transport.RMQ,
					options: {
						urls: ['amqp://localhost:5672'],
						queue: 'user_queue',
					},
				},
				{
					name: 'NOTIFICATION_SERVICE',
					transport: Transport.RMQ,
					options: {
						urls: ['amqp://localhost:5672'],
						queue: 'notification_queue',
					},
				}
			]),
		],
		controllers: [UsersController],
		providers: [UsersService],
	})
	export class UsersModule {}
