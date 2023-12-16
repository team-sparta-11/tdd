import { Controller, Get, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WaitingHeaderSwagger } from './waiting.header.swagger';
import { WaitingService } from './waiting.service';

@ApiTags('waiting')
@WaitingHeaderSwagger()
@Controller('waiting')
export class WaitingController {
  constructor(private readonly service: WaitingService) {}

  @Get('*')
  async checkInTaskQueue(@Headers() headers: { ['waiting-token']: string }) {
    return this.service.checkInTaskQueue(headers['waiting-token']);
  }
}
