import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from 'src/shared/jwt/jwt.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, PrismaService, JwtService],
})
export class FriendsModule {}
