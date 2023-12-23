import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SeatService } from './seat.service';

@Controller('seat')
@UseGuards(AuthGuard('jwt'))
export class SeatController {
  constructor(private seatService: SeatService) {}

  @Get('/available/:date')
  async getAvailableSeatsByDate(
    @Param('date') date: string,
  ): Promise<number[]> {
    return this.seatService.getAvailableSeatsByDate(date);
  }
}
