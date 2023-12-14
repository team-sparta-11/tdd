import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SeatService } from './seat.service';

@Controller('seat')
@UseGuards(AuthGuard('jwt'))
export class SeatController {
  constructor(private seatService: SeatService) {}

  @Get('/available')
  getAvailableDates(): Promise<string[]> {
    return this.seatService.getAvailableDates();
  }

  @Get('/available/:date')
  getAvailableSeatsByDate(@Param('date') date: string): Promise<number[]> {
    return this.seatService.getAvailableSeatsByDate(date);
  }
}
