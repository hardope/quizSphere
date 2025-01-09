import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';

const users = [];

@Injectable()
export class NotificationService {
    handleCreatedUser (user: UserDto) {
        console.log('Emailing User:', user);
    }


}
