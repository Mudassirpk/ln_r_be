import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// extracts user id from an authenticated request
export const UserId = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return user?.id;
  },
);
