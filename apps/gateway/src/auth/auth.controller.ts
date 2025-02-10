import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from '@app/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PasswordResetDto } from './dto/password-reset.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@ApiOperation({ summary: 'Authenticate a user' })
	handleAuth(@Body() data: AuthDTO) {
		return this.authService.handleAuth(data);
	}

	@Post('refresh-token/')
	@ApiOperation({ summary: 'Refresh token' })
	refreshToken(@Body() data: RefreshTokenDto) {
		console.log(data)
		return this.authService.refreshToken(data.token);
	}

	@Post('validate-email/:email/:token')
	@ApiOperation({ summary: 'Validate email' })
	validateEmail(@Param('email') email: string, @Param('token') token: string) {
		return this.authService.validateEmail({email, token});
	}

	@Post('request-password-reset/:email')
	@ApiOperation({ summary: 'Request password reset' })
	requestPasswordReset(@Param('email') email: string) {
		return this.authService.requestPasswordReset(email);
	}

	@Post('reset-password/')
	@ApiOperation({ summary: 'Reset password' })
	resetPassword( @Body() data: PasswordResetDto) {
		return this.authService.resetPassword(data);
	}

	// @Get()
	// findAll() {
	//   return this.authService.findAll();
	// }

	// @Get(':id')
	// findOne(@Param('id') id: string) {
	//   return this.authService.findOne(+id);
	// }

	// @Patch(':id')
	// update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
	//   return this.authService.update(+id, updateAuthDto);
	// }

	// @Delete(':id')
	// remove(@Param('id') id: string) {
	//   return this.authService.remove(+id);
	// }
}
