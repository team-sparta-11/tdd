import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DateEntity } from './struct/date.entity';
import { Date } from './struct/date.domain';

interface Query<T> {
  getAvailableDates(): Promise<T[]>;
}

export class DateReader implements Query<Date> {
  constructor(
    @InjectRepository(DateEntity)
    private readonly dateRepository: Repository<DateEntity>,
  ) {}

  async getAvailableDates(): Promise<Date[]> {
    return await this.dateRepository.find({
      relations: ['seatAvailability'],
      where: {
        seatAvailability: {
          userId: null,
        },
      },
      order: {
        date: 'ASC',
      },
    });
  }
}
