import { Controller, Get } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthDTO } from '@app/common';

@Controller()
export class AuthenticationController {
	constructor(private readonly authService: AuthenticationService) {}

	@Get()
	getHello(): string {
		return this.authService.getHello();
	}

	@MessagePattern({ cmd: 'validateUser' })
	validateUser(@Payload() data: AuthDTO) {
		return this.authService.validateUser(data.email, data.password);
	}

	@MessagePattern({ cmd: 'refreshToken' })
	refreshToken(@Payload() data: {token: string}) {
		return this.authService.refreshToken(data.token);
	}

	@MessagePattern({ cmd: 'validateEmail' })
	validateEmail(@Payload() data: { email: string; token: string }) {
		return this.authService.validateEmail(data.email, data.token);
	}

	@MessagePattern({ cmd: 'passwordReset' })
	passwordReset(@Payload() data: { password: string; token: string }) {
		return this.authService.passwordReset(data.password, data.token);
	}
}
