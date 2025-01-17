import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import {  Payload, MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @MessagePattern({ cmd:'user-created' })
    handleCreatedUser(@Payload() data: UserDto) {
        return this.appService.handleCreatedUser(data);
    }

    @MessagePattern({ cmd: 'fetch-users' })
    handleFetchUsers() {
        return this.appService.handleFetchUsers()
    }
}
