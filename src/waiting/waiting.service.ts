import { Inject, Injectable } from '@nestjs/common';
import { WaitingUtil } from './waiting.util';
import { WaitingScheduleService } from './waiting.schedule.service';
import { ICmdManager, IQueryManager } from '../common/cqrs/icqrs.interface';
import { WaitingToken } from '../common/types/waiting';
import { Command, Query } from './waiting.handler';

@Injectable()
export class WaitingService {
  constructor(
    private readonly util: WaitingUtil,
    @Inject('ICmdManager') private readonly commandManager: ICmdManager,
    @Inject('IQueryManager') private readonly queryManager: IQueryManager,
    private readonly schedule: WaitingScheduleService,
  ) {}
  async work(headerStatusToken?: string) {
    const statusToken =
      headerStatusToken ?? (await this.util.generateStatusToken());

    const taskToken = await this.queryManager.execute<WaitingToken>(
      new Query('isInTask', statusToken),
    );
    if (taskToken.inTask) return taskToken;

    const waitingToken = await this.queryManager.execute(
      new Query('isInWaiting', statusToken),
    );
    if (waitingToken) return waitingToken;

    return this.commandManager.execute(new Command('lpush', statusToken));
  }

  async forceMoveTask() {
    return this.schedule.moveToTask();
  }
}
