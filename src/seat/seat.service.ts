import { Injectable } from '@nestjs/common';
import { SeatReader } from './seat.handler';

@Injectable()
export class SeatService {
  constructor(private seatReader: SeatReader) {}

  async getAvailableSeatsByDate(date: string): Promise<number[]> {
    const seats = await this.seatReader.getAvailableSeatByDate(date);

    return seats.map((seat) => seat.seatNumber);
  }
}
