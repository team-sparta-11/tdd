import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { RedisClientService } from '../common/redis/redis.client-service';

@Injectable()
export class WaitingService {
  constructor(private readonly redis: RedisClientService) {}
  async checkInTaskQueue(waitingToken: string) {
    if (!waitingToken) return this.checkInWaitingToken();
  }

  checkInWaitingToken() {
    const token = `${uuid()}:${new Date().getTime()}`;
    return token;
  }
}
