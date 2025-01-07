import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';

const users: UserDto[] = []

@Injectable()
export class AppService {
	
    handleCreatedUser (user: UserDto) {
        console.log('User created:', user);
        users.push(user);
    }

    handleFetchUsers () {
        return users;
    }
}
