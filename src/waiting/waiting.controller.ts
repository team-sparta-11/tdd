import { Controller, Get, Headers, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WaitingService } from './waiting.service';
import { WaitLayerDecorator } from '../common/guard/wait-layer.decorator';

@ApiTags('waiting')
@Controller('waiting')
export class WaitingController {
  constructor(private readonly service: WaitingService) {}

  @Get('*')
  @WaitLayerDecorator()
  async work(@Headers() headers: { ['status-token']: string }) {
    return this.service.work(headers['status-token']);
  }

  /**
   * @description This method is currently exists for develop.
   * To deploy production, should this logic move to scheduler
   * */
  @Post()
  @WaitLayerDecorator()
  async forceMoveTask() {
    return this.service.forceMoveTask();
  }
}
