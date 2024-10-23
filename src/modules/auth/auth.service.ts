import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SignupDto } from './dto/signup';
import * as bcryptjs from 'bcryptjs';
import { LoginDTO } from './dto/login';
import { JwtService } from 'src/shared/jwt/jwt.service';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async signup(signupDto: SignupDto) {
    try {
      const password = await bcryptjs.hash(signupDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          name: signupDto.name,
          email: signupDto.email,
          password,
        },
      });

      if (user)
        return {
          success: true,
          message: 'sign up sucessful',
        };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  async user(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        post: true,
        followers: true,
        following: true,
        profile_pic: true,
      },
    });

    user.password = null;
    return { ...user, posts: user.post.length };
  }

  async add_user_image(image: Express.Multer.File, userId: string) {
    try {
      const uploaded_image = await this.cloudinary.uploadImage(image);
      const image_object = await this.prisma.image.create({
        data: {
          public_id: uploaded_image.public_id,
          url: uploaded_image.url,
        },
      });
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          profile_pic: {
            connect: {
              id: image_object.id,
            },
          },
        },
      });
      return {
        success: true,
        message: 'Profile image updated successfully',
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }

  async login(loginDto: LoginDTO) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: loginDto.email,
        },
        include: {
          notifications: {
            where: {
              seen: false,
            },
            include: {
              actor: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!user)
        return { success: false, message: 'Invalid email or password' };

      const passwordMatched = bcryptjs.compare(
        loginDto.password,
        user.password,
      );

      if (!passwordMatched)
        return { success: false, message: 'Invalid email or password' };

      const token = this.jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      user.password = null;

      return {
        success: true,
        message: 'Login successfull',
        token,
        user,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Internal server error',
      };
    }
  }
}
