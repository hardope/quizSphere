import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';

@Injectable()
export class AppService {
  handleCreatedUser (user: UserDto) {
    console.log('User created:', user);
  }
}
