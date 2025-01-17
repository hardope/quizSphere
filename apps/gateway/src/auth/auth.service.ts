import { AuthDTO } from '@app/common';
import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';


@Injectable()
export class AuthService {

	constructor (
		@Inject('AUTHENTICATION_SERVICE') private readonly authService: ClientProxy,
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

	async validateEmail(data: { email: string; token: string }) {
		try {
			const res = await this.authService.send({cmd: 'validateEmail'}, data).toPromise();

			if (res?.expired) {
				throw new BadRequestException("Token expired");
			} else if (res) {
				return {
					status: true,
					message: "Email verified successfully"
				}
			}
			throw new BadRequestException("Invalid token");
		} catch (error) {
			Logger.error(error, 'AuthService - validateEmail');
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
