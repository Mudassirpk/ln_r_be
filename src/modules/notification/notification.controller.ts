import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGaurd } from 'guards/auth/auth.guard';
import { UserId } from 'decorators/userId.decorator';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  // TODO: use auth guard here
  @Get('seen/:notificationId')
  updateSeen(@Param('notificationId') notificationId: string) {
    return this.notificationService.updateSeen(notificationId);
  }

  @UseGuards(AuthGaurd)
  @Get('')
  get(@UserId() userId: string) {
    return this.notificationService.get_notifications_for_user(userId);
  }
}
