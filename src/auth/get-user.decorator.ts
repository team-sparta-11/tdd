import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from './struct/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserEntity => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
