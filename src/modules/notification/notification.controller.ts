import { Controller, Get, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  // TODO: use auth guard here
  @Get('seen/:notificationId')
  updateSeen(@Param('notificationId') notificationId: string) {
    return this.notificationService.updateSeen(notificationId);
  }
}
