import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserEntity } from '../../auth/struct/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserEntity => {
    const req = ctx.switchToHttp().getRequest();

    req.user['statusToken'] = req.headers['status-token'];

    return req.user;
  },
);
