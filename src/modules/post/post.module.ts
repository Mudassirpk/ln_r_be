import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from 'src/shared/jwt/jwt.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, JwtService],
})
export class PostModule {}
