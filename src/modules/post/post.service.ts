import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreatePostDTO } from './dto/create';
import { LikeDTO } from './dto/like';
import { NotificationService } from '../notification/notification.service';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { extractHashtags } from 'src/shared/lib/post_utils';
import { IntrestService } from '../intrest/intrest.service';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private notification: NotificationService,
    private readonly cloudinary: CloudinaryService,
    private readonly intrest: IntrestService,
  ) {}

  async create(createPostDTO: CreatePostDTO, image: Express.Multer.File) {
    try {
      let postImage;
      let post;

      if (image) {
        const imageUploaded = await this.cloudinary.uploadImage(image);
        postImage = await this.prisma.image.create({
          data: {
            url: imageUploaded.url,
            public_id: imageUploaded.public_id,
          },
        });

        post = await this.prisma.post.create({
          data: {
            message: createPostDTO.message,
            author: {
              connect: {
                id: createPostDTO.userId,
              },
            },
            image: {
              connect: {
                id: postImage?.id,
              },
            },
          },
        });
      } else {
        post = await this.prisma.post.create({
          data: {
            message: createPostDTO.message,
            author: {
              connect: {
                id: createPostDTO.userId,
              },
            },
          },
        });
      }

      // manage post tags
      const hashtags_in_post = extractHashtags(createPostDTO.message);

      if (hashtags_in_post.length > 0) {
        await this.intrest.createIfNotPresent(hashtags_in_post);
        const save_hastags = await this.prisma.intrest.findMany({
          where: {
            title: {
              in: hashtags_in_post,
            },
          },
        });
        await this.intrest.create_posts_tags_for_new_post(
          save_hastags,
          post.id,
        );
        // update user tags

        await this.intrest.update_user_tags(
          hashtags_in_post,
          createPostDTO.userId,
        );
      }
      // ---- manage post tags

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

  async get({
    cursor,
    limit,
    userId,
  }: {
    cursor?: string;
    limit?: string;
    userId: string;
  }) {
    const includes = {
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
          profile_pic: true,
          followers: {
            select: {
              id: true,
              followingUserId: true,
            },
          },
        },
      },
      comments: {
        include: {
          from: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      image: true,
    };
    const user_intrests = await this.prisma.user_intrest.findMany({
      where: {
        userId,
      },
      include: {
        intrest: true,
      },
    });

    if (cursor && limit) {
      const posts = await this.prisma.post.findMany({
        where: {
          author: {
            following: {
              some: {
                followingUserId: userId,
              },
            },
            followers: {
              some: {
                followedUserId: userId,
              },
            },
          },
          OR: [
            {
              post_tags: {
                some: {
                  tag: {
                    title: {
                      contains: user_intrests
                        .map((ui) => ui.intrest.title)
                        .join(' '),
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
            {
              post_tags: {
                none: {},
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: includes,
        skip: parseInt(cursor) * parseInt(limit),
        take: parseInt(limit),
      });
      return { posts, lastCursor: cursor };
    } else {
      return await this.prisma.post.findMany({
        where: {
          OR: [
            {
              message: {
                contains: user_intrests.map((ui) => ui.intrest.title).join(' '),
                mode: 'insensitive',
              },
              post_tags: {
                some: {
                  tag: {
                    title: {
                      contains: user_intrests
                        .map((ui) => ui.intrest.title)
                        .join(' '),
                      mode: 'insensitive',
                    },
                  },
                },
              },
            },
            {
              post_tags: {
                none: {},
              },
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: includes,
      });
    }
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

      const postAuthor = (
        await this.prisma.post.findUnique({
          where: {
            id: likeDto.post,
          },
          select: {
            author: {
              select: {
                id: true,
              },
            },
          },
        })
      ).author.id;

      const actor = await this.prisma.user.findUnique({
        where: { id: likeDto.from },
      });

      await this.notification.create({
        actorId: likeDto.from,
        to: postAuthor,
        activity: `${actor.name} liked your post`,
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

  async postsByUser(userId: string) {
    return await this.prisma.post.findMany({
      where: {
        author: {
          id: userId,
        },
      },
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
            followers: {
              select: {
                id: true,
                followingUserId: true,
              },
            },
          },
        },
        comments: {
          include: {
            from: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        image: true,
      },
    });
  }
}
