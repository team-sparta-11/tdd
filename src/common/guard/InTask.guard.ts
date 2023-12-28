import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RedisClientService } from '../redis/redis.client-service';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InTaskGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
    private readonly redis: RedisClientService,
  ) {}

  async canActivate(context: ExecutionContext) {
    if (this.configService.get('appConfig.turnOffWaitingGuard')) return true;

    if (this.reflector.get<boolean>('waitLayer', context.getHandler()))
      return true;

    const req = context.switchToHttp().getRequest();
    const token = req.headers['status-token'];

    if (!token) return false;

    return (await this.redis.task.zscore('task', token)) !== null;
  }
}
