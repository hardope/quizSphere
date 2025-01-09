import { Controller, Get } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { UserDto } from './user.dto';

@Controller()
export class NotificationController {
    constructor(private readonly notifiationService: NotificationService) {}

    @EventPattern('user-created')
    handleCreatedUser(@Payload() data: UserDto) {
        return this.notifiationService.handleCreatedUser(data);
    }
}
