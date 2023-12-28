import { Module } from '@nestjs/common';
import { WaitingController } from './waiting.controller';
import { WaitingService } from './waiting.service';
import { WaitingUtil } from './waiting.util';
import { WaitingScheduleService } from './waiting.schedule.service';
import { WaitingManager, WaitingReader } from './waiting.handler';
import { WaitingListener } from './waiting.listener';

@Module({
  controllers: [WaitingController],
  providers: [
    WaitingService,
    WaitingManager,
    WaitingReader,
    WaitingUtil,
    WaitingScheduleService,
    WaitingListener,
  ],
})
export class WaitingModule {}
