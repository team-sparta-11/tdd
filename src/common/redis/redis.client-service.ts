import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class RedisClientService {
  readonly waiting: Redis;
  readonly task: Redis;

  constructor(private readonly service: RedisService) {
    this.waiting = this.service.getClient('waiting');
    this.task = this.service.getClient('task');
  }
}
