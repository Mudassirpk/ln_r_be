import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from 'src/shared/jwt/jwt.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [CommentController],
  providers: [CommentService, PrismaService, JwtService, NotificationService],
})
export class CommentModule {}
