import { Injectable } from '@nestjs/common';
import { WaitingUtil } from './waiting.util';
import { WaitingScheduleService } from './waiting.schedule.service';

@Injectable()
export class WaitingService {
  constructor(
    private readonly util: WaitingUtil,
    private readonly schedule: WaitingScheduleService,
  ) {}
  async work(headerStatusToken?: string) {
    const statusToken =
      headerStatusToken ?? (await this.util.generateStatusToken());

    const taskToken = await this.util.checkInTask(statusToken);
    if (taskToken.inTask) return taskToken;

    const waitingToken = await this.util.checkInWaiting(statusToken);
    if (waitingToken) return waitingToken;

    return this.util.setWaitingToken(statusToken);
  }

  async forceMoveTask() {
    return this.schedule.moveToTask();
  }
}
