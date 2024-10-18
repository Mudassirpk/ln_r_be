import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateCommentDTO } from './dto/create';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  async create(createDTO: CreateCommentDTO) {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          from: {
            connect: {
              id: createDTO.from,
            },
          },
          post: {
            connect: {
              id: createDTO.post,
            },
          },
          message: createDTO.message,
        },
        include: {
          from: {
            select: {
              email: true,
              name: true,
            },
          },
        },
      });

      const to = (
        await this.prisma.post.findUnique({
          where: {
            id: createDTO.post,
          },
          include: {
            author: {
              select: {
                id: true,
              },
            },
          },
        })
      ).author.id;

      await this.notification.create({
        activity: comment.from.name + ' commented on you post',
        to: to,
        actorId: createDTO.from,
      });

      return {
        success: true,
        message: 'comment add successfully',
        comment,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  get() {}
}
