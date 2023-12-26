import { RedisClientService } from '../common/redis/redis.client-service';
import { WaitingToken } from '../common/types/waiting';
import { Injectable } from '@nestjs/common';

interface Command<T> {
  enQueueToWaiting(token: T): Promise<WaitingToken>;
  enQueueToTask(token: string): Promise<void>;
  deQueueFromWaiting(cnt: number): Promise<string[]>;
  deQueueFromTask(cnt: number): Promise<void>;
}

@Injectable()
export class WaitingManager implements Command<string> {
  constructor(private readonly redis: RedisClientService) {}

  async enQueueToWaiting(token: string): Promise<WaitingToken> {
    const score = new Date().getTime();
    await this.redis.waiting.zadd('wait', score, token);
    const rank = +(await this.redis.waiting.zrank('wait', token)) + 1;
    return { rank, token, inTask: false };
  }

  async enQueueToTask(token: string) {
    const taskScore = new Date().getTime();
    this.redis.task.zadd('task', taskScore, token);
  }

  async deQueueFromWaiting(cnt: number) {
    const waiters = this.redis.waiting.zrange('wait', 0, cnt);
    await this.redis.waiting.zremrangebyrank('wait', 0, cnt);
    return waiters;
  }

  async deQueueFromTask(remExpired: number) {
    await this.redis.task.zremrangebyscore(
      'task',
      0,
      new Date().getTime() - remExpired * 1000,
    );
  }
}

interface Query<T> {
  isInTask(token: T): Promise<WaitingToken>;
  isInWaiting(token: T): Promise<WaitingToken | false>;
  getOpenTaskCnt(maxTaskCount: number): Promise<number>;
}

@Injectable()
export class WaitingReader implements Query<string> {
  constructor(private readonly redis: RedisClientService) {}

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

  async getOpenTaskCnt(maxTaskCount: number) {
    return (
      maxTaskCount - (await this.redis.task.zcount('task', '-inf', '+inf'))
    );
  }
}
