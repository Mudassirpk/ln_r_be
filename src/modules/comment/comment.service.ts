import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateCommentDTO } from './dto/create';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

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
