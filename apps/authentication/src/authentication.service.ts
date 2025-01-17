import { PrismaService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
constructor (
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService
	) {}

	getHello(): string {
		return 'Hello World!';
	}

	async validateUser(email: string, password: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					email:email
				}
			});

			if (!user) {
				Logger.log(`User not found ${email}`, 'AuthService - validateUser');
				return null;
			}

			if (bcrypt.compareSync(password, user.password)) {
				const { password, ...result } = user;
				Logger.log(`Authorized User ${email}`, 'AuthService - validateUser');
				return{
					user: result,
					accessToken: this.jwtService.sign({...result, type: 'access'}, {expiresIn: process.env.JWT_ACCESS_EXPIRATION, secret: process.env.JWT_SECRET}),
					refreshToken: this.jwtService.sign({...result, type: 'refresh'}, {expiresIn: process.env.JWT_REFRESH_EXPIRATION, secret: process.env.JWT_SECRET}),
					status: true
				}
				// return result;
			}

			Logger.log(`Invalid Credentials ${email}`, 'AuthService - validateUser');
			return null;
		} catch (error) {
			Logger.error(error, 'AuthService - validateUser');
			return null;
		}
	}
}
