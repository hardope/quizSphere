import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import {  Payload, MessagePattern } from '@nestjs/microservices';
import { UpdateUserDto } from 'apps/gateway/src/users/dto/update-user.dto';
import { UpdateUserDTO } from '@app/common/dto/updateUser.dto';

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

    @MessagePattern({ cmd: 'fetch-user-by-id' })
    handleFetchUserById(id: string) {
        return this.appService.handleFetchUserById(id);
    }

    @MessagePattern({ cmd: 'fetch-user-by-email' })
    handleFetchUserByEmail(@Payload() email: string) {
        return this.appService.handleFetchUserByEmail(email);
    }

    @MessagePattern({ cmd: 'update-user' })
    handleUpdateUser(@Payload() data: { id: string, data: UpdateUserDTO, user: any }) {
        return this.appService.handleUpdateUser(data);
    }
}
