import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WaitingManager } from './waiting.handler';

@Injectable()
export class WaitingListener {
  constructor(private readonly manager: WaitingManager) {}

  @OnEvent('task.done')
  async handleTaskDone({ token }: { token: string }) {
    this.manager.deQueueFromTaskByToken(token);
  }
}
