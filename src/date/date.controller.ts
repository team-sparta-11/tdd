import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DateService } from './date.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('date')
@Controller('date')
@UseGuards(AuthGuard('jwt'))
export class DateController {
  constructor(private dateService: DateService) {}

  @Get('/available')
  getAvailableDates(): Promise<string[]> {
    return this.dateService.getAvailableDates();
  }
}
