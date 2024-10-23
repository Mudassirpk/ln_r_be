import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { JwtService } from 'src/shared/jwt/jwt.service';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, CloudinaryService],
})
export class AuthModule {}
