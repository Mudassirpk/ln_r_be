import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from 'src/shared/jwt/jwt.service';

export const UserId = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.id;
  },
);
