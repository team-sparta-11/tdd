import { Injectable } from '@nestjs/common';
import { WaitingUtil } from './waiting.util';
import { WaitingScheduleService } from './waiting.schedule.service';
import { WaitingManager, WaitingReader } from './waiting.handler';

@Injectable()
export class WaitingService {
  constructor(
    private readonly util: WaitingUtil,
    private readonly manager: WaitingManager,
    private readonly reader: WaitingReader,
    private readonly schedule: WaitingScheduleService,
  ) {}
  async work(headerStatusToken?: string) {
    const statusToken =
      headerStatusToken ?? (await this.util.generateStatusToken());

    const taskToken = await this.reader.isInTask(statusToken);
    if (taskToken.inTask) return taskToken;

    const waitingToken = await this.reader.isInWaiting(statusToken);
    if (waitingToken) return waitingToken;

    return this.manager.enQueueToWaiting(statusToken);
  }

  async forceMoveTask() {
    return this.schedule.moveToTask();
  }
}
