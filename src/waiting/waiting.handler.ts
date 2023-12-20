import { RedisClientService } from '../common/redis/redis.client-service';
import { WaitingToken } from '../common/types/waiting';
import { Injectable } from '@nestjs/common';

import {
  ICmdManager,
  ICommand,
  IQuery,
  IQueryManager,
} from '../common/cqrs/icqrs.interface';

export class Command implements ICommand {
  constructor(
    public readonly cmd: 'lpush',
    public readonly data?: unknown,
  ) {}
}

export class Query implements IQuery {
  constructor(
    public readonly query: 'isInTask' | 'isInWaiting',
    public readonly data?: unknown,
  ) {}
}

@Injectable()
export class WaitingCmdManger implements ICmdManager {
  constructor(private readonly redis: RedisClientService) {}

  async lpush(token: string): Promise<WaitingToken> {
    const score = new Date().getTime();
    await this.redis.waiting.zadd('wait', score, token);
    const rank = +(await this.redis.waiting.zrank('wait', token)) + 1;
    return { rank, token, inTask: false };
  }

  async execute<T>(cmd: ICommand): Promise<T> {
    return this[cmd.cmd](cmd.data);
  }
}

@Injectable()
export class WaitingQueryManger implements IQueryManager {
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

  async execute<T>(query: IQuery): Promise<T> {
    return this[query.query](query.data);
  }
}
