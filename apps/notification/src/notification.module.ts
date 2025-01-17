import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MailService } from './mail/mail.service';
import { PrismaService } from '@app/common';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService, MailService, PrismaService],
})
export class NotificationModule {}
