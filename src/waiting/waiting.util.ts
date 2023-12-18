import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientService } from '../common/redis/redis.client-service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class WaitingUtil {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisClientService,
  ) {}

  async generateStatusToken() {
    return uuid();
  }

  async checkInTask(token: string) {
    return {
      rank: 0,
      token,
      inTask: !!(await this.redis.task.zscore('task', token)),
    };
  }

  async checkInWaiting(token: string) {
    const rank = await this.redis.waiting.zrank('wait', token);

    if (rank === null) return false;

    return {
      rank: rank + 1,
      token,
      inTask: false,
    };
  }

  async setWaitingToken(token: string) {
    const score = new Date().getTime();
    await this.redis.waiting.zadd('wait', score, token);
    const rank = +(await this.redis.waiting.zrank('wait', token)) + 1;
    return { rank, token, inTask: false };
  }
}
