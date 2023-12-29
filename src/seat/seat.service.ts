import { Injectable } from '@nestjs/common';
import { SeatReader } from './seat.handler';

@Injectable()
export class SeatService {
  constructor(private seatReader: SeatReader) {}

  getAvailableSeatsByDate(date: string): Promise<number[]> {
    return this.seatReader.getAvailableSeatByDate(date);
  }
}
