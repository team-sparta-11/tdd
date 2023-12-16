import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('waiting')
@Controller('waiting')
export class WaitingController {
  @Get('/*')
  async passGetService(@Param() prams: string) {
    console.log(prams);
    return 1;
  }
}
