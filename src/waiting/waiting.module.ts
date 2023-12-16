import { Module } from '@nestjs/common';
import { WaitingController } from './waiting.controller';
import { WaitingService } from './waiting.service';
import { RedisClientService } from '../common/redis/redis.client-service';

@Module({
  controllers: [WaitingController],
  providers: [WaitingService, RedisClientService],
})
export class WaitingModule {}
