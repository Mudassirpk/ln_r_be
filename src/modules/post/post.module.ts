import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from 'src/shared/jwt/jwt.service';
import { NotificationService } from '../notification/notification.service';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { IntrestService } from '../intrest/intrest.service';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PrismaService,
    JwtService,
    NotificationService,
    CloudinaryService,
    IntrestService,
  ],
})
export class PostModule {}
