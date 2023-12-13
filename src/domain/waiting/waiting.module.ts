import { Module } from '@nestjs/common';
import { WaitingController } from './waiting.controller';
import { WaitingService } from './waiting.service';
import { BullModule } from '@nestjs/bull';
import { WaitingConsumer } from './waiting.consumer';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'waitingQ',
      },
      {
        name: 'taskQ',
      },
    ),
  ],
  controllers: [WaitingController],
  providers: [WaitingService, WaitingConsumer],
})
export class WaitingModule {}
