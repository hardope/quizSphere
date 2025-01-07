import { Injectable } from '@nestjs/common';
// import { UserDto } from '../../user-service/src/user.dto';

@Injectable()
export class AppService {
	
	handleCreatedUser (user: any) {
		console.log('Sending Email:', user);
	}
}
