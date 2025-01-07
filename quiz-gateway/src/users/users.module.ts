	import { Module } from '@nestjs/common';
	import { UsersService } from './users.service';
	import { UsersController } from './users.controller';
	import { ClientsModule, Transport } from '@nestjs/microservices';

	@Module({
		imports: [
			ClientsModule.register([
				{
					name: 'QUIZ_SERVICE',
					transport: Transport.RMQ,
					options: {
						urls: ['amqp://localhost:5672'],
						queue: 'quiz_queue',
					},
				}
			]),
		],
		controllers: [UsersController],
		providers: [UsersService],
	})
	export class UsersModule {}
