import { RedisClientService } from '../common/redis/redis.client-service';
import { WaitingToken } from '../types/waiting';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Command<T> {
  lpush(token: T): Promise<WaitingToken>;
}

@Injectable()
export class WaitingManager implements Command<string> {
  constructor(private readonly redis: RedisClientService) {}

  async lpush(token: string): Promise<WaitingToken> {
    const score = new Date().getTime();
    await this.redis.waiting.zadd('wait', score, token);
    const rank = +(await this.redis.waiting.zrank('wait', token)) + 1;
    return { rank, token, inTask: false };
  }
}

interface Query<T> {
  isInTask(token: T): Promise<WaitingToken>;
  isInWaiting(token: T): Promise<WaitingToken | false>;
}

@Injectable()
export class WaitingReader implements Query<string> {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisClientService,
  ) {}

  async isInTask(token: string): Promise<WaitingToken> {
    return {
      rank: 0,
      token,
      inTask: !!(await this.redis.task.zscore('task', token)),
    };
  }

  async isInWaiting(token: string): Promise<WaitingToken | false> {
    const rank = await this.redis.waiting.zrank('wait', token);

    if (rank === null) return false;

    return {
      rank: rank + 1,
      token,
      inTask: false,
    };
  }
}
