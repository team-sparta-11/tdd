import { Module } from '@nestjs/common';
import { WaitingController } from './waiting.controller';
import { WaitingService } from './waiting.service';
import { RedisClientService } from '../common/redis/redis.client-service';
import { WaitingUtil } from './waiting.util';
import { WaitingScheduleService } from './waiting.schedule.service';

@Module({
  controllers: [WaitingController],
  providers: [
    WaitingService,
    WaitingUtil,
    WaitingScheduleService,
    RedisClientService,
  ],
})
export class WaitingModule {}
