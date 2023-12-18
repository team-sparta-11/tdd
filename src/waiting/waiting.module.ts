import { Module } from '@nestjs/common';
import { WaitingController } from './waiting.controller';
import { WaitingService } from './waiting.service';
import { RedisClientService } from '../common/redis/redis.client-service';
import { WaitingUtil } from './waiting.util';
import { WaitingScheduleService } from './waiting.schedule.service';
import { WaitingManager, WaitingReader } from './waiting.handler';

@Module({
  controllers: [WaitingController],
  providers: [
    WaitingService,
    WaitingManager,
    WaitingReader,
    WaitingUtil,
    WaitingScheduleService,
    RedisClientService,
  ],
})
export class WaitingModule {}
