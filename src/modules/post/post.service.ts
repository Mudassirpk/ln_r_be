import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreatePostDTO } from './dto/create';
import { LikeDTO } from './dto/like';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDTO: CreatePostDTO) {
    try {
      const post = await this.prisma.post.create({
        data: {
          message: createPostDTO.message,
          author: {
            connect: {
              id: createPostDTO.userId,
            },
          },
        },
      });

      if (post)
        return {
          success: true,
          message: 'Post created successfully',
        };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  async get() {
    return await this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        likes: {
          include: {
            from: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: {
          include: {
            from: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async like(likeDto: LikeDTO) {
    try {
      await this.prisma.like.create({
        data: {
          from: {
            connect: {
              id: likeDto.from,
            },
          },
          post: {
            connect: {
              id: likeDto.post,
            },
          },
        },
      });

      return {
        success: true,
        message: 'feedback provided',
      };
    } catch (error) {
      console.log(error);
      return {
        success: true,
        message: 'Internal server error',
      };
    }
  }
}
