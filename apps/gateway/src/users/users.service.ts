import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import { UpdateUserDTO } from '@app/common/dto/updateUser.dto';

@Injectable()
export class UsersService {

	constructor (
		@Inject('USER_SERVICE') private readonly userService: ClientProxy,
		@Inject('NOTIFICATION_SERVICE') private readonly notificationService: ClientProxy
	) {}
	

	async create(createUserDto: CreateUserDto) {
		const userRes = await this.userService.send({cmd: 'user-created'}, createUserDto).toPromise();
		if (userRes.status) {
			this.notificationService.emit('user-created', {
				...createUserDto,
				id: userRes.user.id
			})
			return userRes;
		} else {
			throw new BadRequestException(userRes.message);
		}
	}

	findAll() {
		return this.userService.send({cmd: 'fetch-users'}, {}).pipe(
			timeout(5000)
		);
	}

	async findOne(id: string) {
		const user = await this.userService.send({cmd: 'fetch-user-by-id'}, id).toPromise();
		if (!user) {
			throw new BadRequestException('User not found');
		}
		return user;
	}

	async update(id: string, updateUserDto: UpdateUserDTO, req: any) {
		const user = await this.userService.send({cmd: 'update-user'}, {id: id, data: updateUserDto, user: req.user}).toPromise();
		if (!user) {
			throw new BadRequestException('User not found');
		} else if (!user.status) {
			throw new BadRequestException(user.message);
		}

		return user;
	}

	async getUserByEmail(email: string) {
		return this.userService.send({cmd: 'fetch-user-by-email'}, {email}).pipe(
			timeout(5000)
		);
	}
}
