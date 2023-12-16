import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WaitingHeaderSwagger } from './waiting.header.swagger';
import { WaitingService } from './waiting.service';

@ApiTags('waiting')
@WaitingHeaderSwagger()
@Controller('waiting')
export class WaitingController {
  constructor(private readonly service: WaitingService) {}
}
