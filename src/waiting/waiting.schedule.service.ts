import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientService } from '../common/redis/redis.client-service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WaitingScheduleService {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisClientService,
  ) {}

  /**
   * @description
   * 1. get how many task will run
   * 2. get open count in task line
   *  - when not exists in task line, just return
   * 3. de-queue tokens from waiting queue
   * 4. apply new score as just in case, then push to task line
   * */
  @Cron('* * * * * *')
  async moveToTask() {
    // get how many task will run
    const moveCnt = this.config.get('appConfig')['maxTask'];

    // get open count in task line
    const remains =
      moveCnt - (await this.redis.task.zcount('task', '-inf', '+inf')) - 1;

    // when no left open yet
    if (remains < 0) return true;

    // de-queue
    const waiters = await this.redis.waiting.zrange('wait', 0, remains);
    await this.redis.waiting.zremrangebyrank('wait', 0, remains);

    // new score for task line.
    const taskScore = new Date().getTime();

    // en-queue for task line
    await Promise.all(
      waiters.map((token) => {
        this.redis.task.zadd('task', taskScore, token);
      }),
    );
  }

  /**
   * @description
   * expiring task line, to prevent any token take task line extremely long time
   * */
  @Cron('* * * * * *')
  async expire() {
    const remExpired = this.config.get('appConfig')['taskExpired'];
    await this.redis.task.zremrangebyscore(
      'task',
      0,
      new Date().getTime() - remExpired * 1000,
    );
  }
}
