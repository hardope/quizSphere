import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
// import { UserDto } from '../../user-service/src/user.dto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @EventPattern('user-created')
    handleCreatedUser(@Payload() data: any) {
        return this.appService.handleCreatedUser(data);
    }
}
