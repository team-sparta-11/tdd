import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SeatService } from './seat.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('seat')
@Controller('seat')
@UseGuards(AuthGuard('jwt'))
export class SeatController {
  constructor(private seatService: SeatService) {}

  @Get('/available/:date')
  @ApiParam({ name: 'date', required: true, example: '2024-01-01' })
  async getAvailableSeatsByDate(
    @Param('date') date: string,
  ): Promise<number[]> {
    return this.seatService.getAvailableSeatsByDate(date);
  }
}
