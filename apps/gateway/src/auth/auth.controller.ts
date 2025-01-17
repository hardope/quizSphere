import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from '@app/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@ApiOperation({ summary: 'Authenticate a user' })
	handleAuth(@Body() data: AuthDTO) {
		return this.authService.handleAuth(data);
	}

	@Post('validate-email/:email/:token')
	@ApiOperation({ summary: 'Validate email' })
	validateEmail(@Param('email') email: string, @Param('token') token: string) {
		return this.authService.validateEmail({email, token});
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
