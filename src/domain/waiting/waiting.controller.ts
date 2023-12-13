import { Controller, Post } from '@nestjs/common';
import { WaitingService } from './waiting.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('waiting')
@Controller('waiting')
export class WaitingController {
  constructor(private readonly service: WaitingService) {}

  @ApiOperation({ summary: '토큰 발급' })
  @Post()
  async issue() {
    return this.service.issueToken();
  }
}
