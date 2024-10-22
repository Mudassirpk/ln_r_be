import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './shared/prisma/prisma.service';
import { PrismaModule } from './shared/prisma/prisma.module';
import { JwtService } from './shared/jwt/jwt.service';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { multerStorage } from './shared/lib/utils';
import { FriendsModule } from './modules/friends/friends.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    PostModule,
    CommentModule,
    NotificationModule,
    CloudinaryModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtService],
})
export class AppModule {}
