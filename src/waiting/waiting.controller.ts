import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('waiting')
@Controller('waiting')
export class WaitingController {}
