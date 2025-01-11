import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class UsersService {

	constructor (
		@Inject('USER_SERVICE') private readonly userService: ClientProxy,
		@Inject('NOTIFICATION_SERVICE') private readonly notificationService: ClientProxy
	) {}
	

	async create(createUserDto: CreateUserDto) {
		const userRes = this.userService.send({cmd: 'user-created'}, createUserDto).toPromise();
		this.notificationService.emit('user-created', createUserDto)
		return userRes;
	}

	findAll() {
		return this.userService.send({cmd: 'fetch-users'}, {}).pipe(
			timeout(5000)
		);
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
