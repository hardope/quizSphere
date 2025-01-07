import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {

	constructor (
		@Inject('USER_SERVICE') private readonly client: ClientProxy,
		@Inject('EMAIL_SERVICE') private readonly emailService: ClientProxy
	) {}
	

	create(createUserDto: CreateUserDto) {
		this.client.emit('user-created', createUserDto);
		this.emailService.emit('user-created', createUserDto)
		return { message: 'User created' };
	}

	findAll() {
		return this.client.send({cmd: 'fetch-users'}, {});
	}

	findOne(id: number) {
		return `This action returns a #${id} user`;
	}

	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`;
	}

	remove(id: number) {
		return `This action removes a #${id} user`;
	}
}
