import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class WaitingService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectQueue('waitingQ') private waitingQ: Queue,
  ) {}

  async issueToken() {
    await this.waitingQ.add(1);

    return {
      // token,
      // remains: remains + 1,
    };
  }
}
