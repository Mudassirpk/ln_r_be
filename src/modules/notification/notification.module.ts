import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from 'src/shared/jwt/jwt.service';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    PrismaService,
    NotificationService,
    JwtService,
  ],
})
export class NotificationModule {}
