import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
	imports: [
		UsersModule,
		ClientsModule.register([
			{
				name: 'USER_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: ['amqp://localhost:5672'],
					queue: 'user_queue',
				},
			}
		]),
		ClientsModule.register([
			{
				name: 'EMAIL_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: ['amqp://localhost:5672'],
					queue: 'email_queue',
				},
			}
		]),
	],
	controllers: [AppController],
	providers: [AppService, UsersService],
	exports: [ClientsModule]
})
export class AppModule {}
