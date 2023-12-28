import { Injectable } from '@nestjs/common';
import { DateReader } from './date.handler';

@Injectable()
export class DateService {
  constructor(private dateReader: DateReader) {}

  getAvailableDates(): Promise<string[]> {
    return this.dateReader.getAvailableDates();
  }
}
