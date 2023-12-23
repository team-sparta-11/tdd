import { Injectable } from '@nestjs/common';
import { DateReader } from './date.handler';

@Injectable()
export class DateService {
  constructor(private dateReader: DateReader) {}

  async getAvailableDates(): Promise<string[]> {
    const dates = await this.dateReader.getAvailableDates();

    return dates.map((date) => date.date);
  }
}
