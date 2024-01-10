import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DateEntity } from './struct/date.entity';

interface Query {
  getAvailableDates(): Promise<string[]>;
}

export class DateReader implements Query {
  constructor(
    @InjectRepository(DateEntity)
    private readonly dateRepository: Repository<DateEntity>,
  ) {}

  async getAvailableDates(): Promise<string[]> {
    const dates = await this.dateRepository
      .createQueryBuilder('date')
      .leftJoinAndSelect('date.seatAvailability', 'seatAvailability')
      .where('seatAvailability.userId IS NULL')
      .orderBy('date.date', 'ASC')
      .getMany();

    return dates.map((date) => date.date);
  }
}
