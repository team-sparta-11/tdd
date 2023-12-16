import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientService } from '../common/redis/redis.client-service';

@Injectable()
export class WaitingScheduleService {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisClientService,
  ) {}

  /**
   * @Todo: check expired tasking user remove by zrembyscore
   * */
  async moveToTask() {
    const moveCnt = this.config.get('appConfig')['maxTask'];

    const remains =
      moveCnt - (await this.redis.task.zcount('task', '-inf', '+inf')) - 1;

    if (remains < 0) return true;

    const waiters = await this.redis.waiting.zrange('wait', 0, remains);
    await this.redis.waiting.zremrangebyrank('wait', 0, remains);

    const taskScore = new Date().getTime();
    await Promise.all(
      waiters.map((token) => {
        this.redis.task.zadd('task', taskScore, token);
      }),
    );
  }
}
