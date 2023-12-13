import { Processor } from '@nestjs/bull';

@Processor('waitingQ')
export class WaitingConsumer {}
