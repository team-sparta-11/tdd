import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SeatService } from './seat.service';
import { Seat } from './seat.domain';

@Controller('seat')
@UseGuards(AuthGuard('jwt'))
export class SeatController {
  constructor(private seatService: SeatService) {}

  @Get('/available/:date')
  async getAvailableSeatsByDate(
    @Param('date') date: string,
  ): Promise<number[]> {
    const seats = await this.seatService.getAvailableSeatsByDate(date);

    return seats.map((seat) => seat.seatNumber);
  }
}
