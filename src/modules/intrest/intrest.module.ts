import { Module } from '@nestjs/common';
import { IntrestService } from './intrest.service';
import { IntrestController } from './intrest.controller';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Module({
  controllers: [IntrestController],
  providers: [IntrestService, PrismaService],
})
export class IntrestModule {}
