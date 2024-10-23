import { Injectable } from '@nestjs/common';
import { intrest } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class IntrestService {
  constructor(private readonly prisma: PrismaService) {}

  async createIfNotPresent(hashtags: string[]) {
    try {
      const present = await this.prisma.intrest.findMany({
        where: {
          title: {
            in: hashtags,
          },
        },
      });

      if (present && present.length > 0) {
        // update the usage count of tags which are already present
        await this.prisma.intrest.updateMany({
          where: {
            title: {
              in: present.map((t) => t.title),
            },
          },
          data: {
            used_count: {
              increment: 1,
            },
          },
        });

        // find the tags which were not found
        const not_present_tags = hashtags.filter((ht) =>
          present.some((pt) => pt.title !== ht),
        );

        if (not_present_tags) {
          // created the newly found tags
          const newly_created_tags =
            await this.prisma.intrest.createManyAndReturn({
              data: not_present_tags.map((ht) => {
                return {
                  title: ht,
                  used_count: 0,
                };
              }),
            });

          return newly_created_tags;
        }
      } else {
        // if all the tags were not found in db created them
        const newly_created_tags =
          await this.prisma.intrest.createManyAndReturn({
            data: hashtags.map((ht) => {
              return {
                title: ht,
                used_count: 0,
              };
            }),
          });

        return newly_created_tags;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async create_posts_tags_for_new_post(hashtags: intrest[], postId: string) {
    try {
      await this.prisma.post_tag.createMany({
        data: hashtags.map((tag) => {
          return {
            postId,
            intrestId: tag.id,
          };
        }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async tags_by_titles(titles: string[]) {
    return await this.prisma.intrest.findMany({
      where: {
        title: {
          in: titles,
        },
      },
    });
  }

  async update_user_tags(tags: string[], userId: string) {
    const present_user_tags = await this.prisma.user_intrest.findMany({
      where: {
        AND: {
          intrest: {
            title: {
              in: tags.map((t) => t),
            },
          },
          userId,
        },
      },
      include: {
        intrest: true,
      },
    });

    if (present_user_tags.length > 0) {
      const not_present_tags = tags.filter((t) =>
        present_user_tags.some((put) => put.intrest.title !== t),
      );

      if (not_present_tags.length > 0) {
        const tags_for_titles = await this.tags_by_titles(not_present_tags);
        await this.prisma.user_intrest.createMany({
          data: tags_for_titles.map((t) => {
            return {
              intrestId: t.id,
              userId,
            };
          }),
        });
      }
    } else {
      const tags_for_titles = await this.tags_by_titles(tags);
      await this.prisma.user_intrest.createMany({
        data: tags_for_titles.map((t) => {
          return {
            intrestId: t.id,
            userId,
          };
        }),
      });
    }
  }
}
