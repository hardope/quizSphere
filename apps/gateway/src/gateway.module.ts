import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';


@Module({
	imports: [
		UsersModule,
		AuthModule,
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
			},
			{
				name: 'AUTHENTICATION_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: ['amqp://localhost:5672'],
					queue: 'auth_queue',
				},
			}
		]),
	],
	controllers: [GatewayController],
	providers: [GatewayService, UsersService, AuthService],
	exports: [ClientsModule]
})
export class AppModule {}
