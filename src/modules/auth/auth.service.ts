import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SignupDto } from './dto/signup';
import * as bcryptjs from 'bcryptjs';
import { LoginDTO } from './dto/login';
import { JwtService } from 'src/shared/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
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
    });
    const postsCount = await this.prisma.post.count({
      where: {
        author: {
          id: user.id,
        },
      },
    });
    user.password = null;
    return { ...user, posts: postsCount };
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

      const token = this.jwt.sign({ email: user.email, name: user.name });
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
