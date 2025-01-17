import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { UpdateUserDTO } from '@app/common/dto/updateUser.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new user' })
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get all users' })
	findAll(@Req () req) {
		console.log(req.user);
		return this.usersService.findAll();
	}	

	@Get(':id')
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get a user by ID' })
	findOne(@Param('id') id: string) {
		console.log(id);
		return this.usersService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update a user by ID' })
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDTO, @Req() req) {
		return this.usersService.update(id, updateUserDto, req);
	}

	@Get('email/:email')
	@UseGuards(JwtGuard)
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get a user by email' })
	getUserByEmail(@Param('email') email: string) {
		return this.usersService.getUserByEmail(email);
	}

	// @Delete(':id')
	// @ApiOperation({ summary: 'Delete a user by ID' })
	// remove(@Param('id') id: string) {
	// 	return this.usersService.remove(+id);
	// }
}
