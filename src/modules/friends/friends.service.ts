import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { create } from './dto/create.dto';
import { FOLLOWING_STATUS } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFollowers(userId: string) {
    return await this.prisma.userFollowing.findMany({
      where: {
        followedUser: {
          id: userId,
        },
      },
      include: {
        followingUser: {
          select: {
            name: true,
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async create(createDto: create) {
    try {
      await this.prisma.userFollowing.create({
        data: {
          followedUser: {
            connect: {
              id: createDto.followedUserId,
            },
          },
          followingUser: {
            connect: {
              id: createDto.followingUserId,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Follow requset sent successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Could create a follow request please try later',
      };
    }
  }

  async getFollowings(userId: string) {
    return await this.prisma.userFollowing.findMany({
      where: {
        followingUser: {
          id: userId,
        },
      },
      include: {
        followedUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async toggleStatus(id: string, status: FOLLOWING_STATUS) {
    try {
      await this.prisma.userFollowing.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });

      return {
        success: true,
        message: `success`,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: `Internal server error`,
      };
    }
  }
}
