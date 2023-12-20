import { Module } from '@nestjs/common';
import { WaitingController } from './waiting.controller';
import { WaitingService } from './waiting.service';
import { RedisClientService } from '../common/redis/redis.client-service';
import { WaitingUtil } from './waiting.util';
import { WaitingScheduleService } from './waiting.schedule.service';
import { WaitingCmdManger, WaitingQueryManger } from './waiting.handler';
// import { WaitingManager, WaitingReader } from './waiting.handler';

@Module({
  controllers: [WaitingController],
  providers: [
    WaitingService,
    // { provide: 'Command', useClass: WaitingManager },
    // { provide: 'Query', useClass: WaitingReader },
    { provide: 'ICmdManager', useClass: WaitingCmdManger },
    { provide: 'IQueryManager', useClass: WaitingQueryManger },
    WaitingUtil,
    WaitingScheduleService,
    RedisClientService,
  ],
})
export class WaitingModule {}
