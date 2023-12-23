import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DateEntity } from './date.entity';
import { Date } from './date.domain';

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
          isAvailable: true,
        },
      },
      order: {
        date: 'ASC',
      },
    });
  }
}
