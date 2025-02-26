import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@app/common';


@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
	],
	controllers: [AppController],
	providers: [AppService,PrismaService],
})
export class AppModule {}
