import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { WaitingManager, WaitingReader } from './waiting.handler';

@Injectable()
export class WaitingScheduleService {
  constructor(
    private readonly config: ConfigService,
    private readonly manager: WaitingManager,
    private readonly reader: WaitingReader,
  ) {}

  /**
   * @description
   * 1. get how many task will run
   * 2. get open count in task line
   *  - when not exists in task line, just return
   * 3. de-queue tokens from waiting queue
   * 4. apply new score for expired, then push to task line
   * */
  @Cron('0 * * * * *')
  async moveToTask() {
    // get how many task will run
    const moveCnt = this.config.get('appConfig')['maxTask'];

    // get open count in task line
    const remains = await this.reader.getOpenTaskCnt(moveCnt);

    // when no left open yet
    if (remains <= 0) return true;

    // de-queue
    const waiters = await this.manager.deQueueFromWaiting(remains);

    // en-queue for task line
    await Promise.all(
      waiters.map((token) => {
        this.manager.enQueueToTask(token);
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
    await this.manager.deQueueFromTaskByExpired(remExpired);
  }
}
