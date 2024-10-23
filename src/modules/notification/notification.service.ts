import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateNotificationDTO } from './dto/create';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDTO: CreateNotificationDTO) {
    try {
      if (createDTO.actorId) {
        await this.prisma.notification.create({
          data: {
            actor: {
              connect: {
                id: createDTO.actorId,
              },
            },
            to: {
              connect: {
                id: createDTO.to,
              },
            },
            activity: createDTO.activity,
          },
        });
      } else {
        await this.prisma.notification.create({
          data: {
            to: {
              connect: {
                id: createDTO.to,
              },
            },
            activity: createDTO.activity,
          },
        });
      }

      return {
        success: true,
        message: 'notification addedd successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  async updateSeen(notificationId: string) {
    try {
      return await this.prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          seen: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async get_notifications_for_user(userId: string) {
    return await this.prisma.notification.findMany({
      where: {
        to: {
          id: userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        actor: {
          select: {
            name: true,
            email: true,
            id: true,
          },
        },
      },
    });
  }
}
