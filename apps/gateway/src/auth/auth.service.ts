import { AuthDTO } from '@app/common';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class AuthService {

	constructor (
		@Inject('AUTHENTICATION_SERVICE') private readonly authService: ClientProxy,
		@Inject('NOTIFICATION_SERVICE') private readonly notificationService: ClientProxy
	) {}

	async handleAuth(data: AuthDTO) {
		try {
			const res = await this.authService.send({cmd: 'validateUser'}, data).toPromise();
			if (res.status) {
				return res;
			}
			throw new BadRequestException("Invalid credentials");
		} catch (error) {
			console.log(error);
			throw new BadRequestException("Invalid credentials");
		}
	}

	async refreshToken(token: string) {
		try {
			console.log(token)
			const res = await this.authService.send({cmd: 'refreshToken'}, {token}).toPromise();
			if (res) {
				return res;
			}
			throw new BadRequestException("Invalid token");
		} catch (error) {
			Logger.error(error, 'AuthService - refreshToken');
			throw error;
		}
	}

	async validateEmail(data: { email: string; token: string }) {
		try {
			const res = await this.authService.send({cmd: 'validateEmail'}, data).toPromise();

			if (res.status) {
				return res;
			}
			throw new BadRequestException(res.message);
		} catch (error) {
			Logger.error(error, 'AuthService - validateEmail');
			throw error;
		}
	}

	async requestPasswordReset(email: string) {
		try {
			this.notificationService.emit('request-password-reset', {email});
			
			return {
				status: true,
				message: 'Password reset link sent to email'
			}
		} catch (error) {
			Logger.error(error, 'AuthService - requestPasswordReset');
			throw error;
		}
	}

	async resetPassword(data: { password: string; token: string }) {
		try {
			const res = await this.authService.send({cmd: 'passwordReset'}, data).toPromise();
			if (res.status) {
				return res;
			}
			throw new BadRequestException(res.message);
		} catch (error) {
			Logger.error(error, 'AuthService - resetPassword');
			throw error;
		}
	}

	// findAll() {
	// 	return `This action returns all auth`;
	// }

	// findOne(id: number) {
	// 	return `This action returns a #${id} auth`;
	// }

	// update(id: number, updateAuthDto: UpdateAuthDto) {
	// 	return `This action updates a #${id} auth`;
	// }

	// remove(id: number) {
	// 	return `This action removes a #${id} auth`;
	// }
}
