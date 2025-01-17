import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

	const config = new DocumentBuilder()
    .setTitle('QuizSphere API Gateway')
    .setDescription('API endpoints for quizSphere API gateway')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

	const docs = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('docs', app, docs);

	app.enableCors({
		origin: true,
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
