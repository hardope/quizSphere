import { Injectable, Logger } from '@nestjs/common';
import { UserDto } from './user.dto';
import { MailService } from './mail/mail.service';

@Injectable()
export class NotificationService {

    constructor (
        private readonly mailService: MailService
    ) {}

    handleCreatedUser (user: UserDto) {
        this.mailService.userCreated(user);
        Logger.log(`Emailing User: ${user.email}`, 'NotificationService');
    }

    handleRequestPsswordReset(user: any) {
        this.mailService.requestPasswordReset(user.email);
        Logger.log(`Requesting Password Reset: ${user.email}`, 'NotificationService');
    }


}
