import { Injectable } from '@nestjs/common';
import { SeatReader } from './seat.handler';
import { Seat } from './seat.domain';

@Injectable()
export class SeatService {
  constructor(private seatReader: SeatReader) {}

  async getAvailableSeatsByDate(date: string): Promise<Seat[]> {
    return this.seatReader.getAvailableSeatByDate(date);
  }
}
