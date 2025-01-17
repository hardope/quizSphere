import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { PrismaService } from '@app/common';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [],
	controllers: [AuthenticationController],
	providers: [AuthenticationService, PrismaService, JwtService],
})
export class AuthenticationModule {}
