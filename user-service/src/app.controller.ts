import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UserDto } from './user.dto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @EventPattern('user-created')
    handleCreatedUser(@Payload() data: UserDto) {
        return this.appService.handleCreatedUser(data);
    }

    @MessagePattern({cmd: 'fetch-users'})
    handleFetchUsers() {
        return this.appService.handleFetchUsers()
    }
}
