import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RedisClientService } from '../redis/redis.client-service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class InTaskGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly redis: RedisClientService,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (this.reflector.get<boolean>('waitLayer', context.getHandler()))
      return true;

    const req = context.switchToHttp().getRequest();
    const token = req.headers['status-token'];

    if (!token) return false;

    return (await this.redis.task.zscore('task', token)) !== null;
  }
}
