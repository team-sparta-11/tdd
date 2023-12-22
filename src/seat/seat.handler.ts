import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SeatEntity } from './seat.entity';
import { Seat } from './seat.domain';

interface Query<T> {
  getAvailableSeatByDate(date: string): Promise<T[]>;
}

export class SeatReader implements Query<Seat> {
  constructor(
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
  ) {}

  async getAvailableSeatByDate(date: string): Promise<Seat[]> {
    return await this.seatRepository.find({
      relations: ['dateAvailability'],
      where: {
        dateAvailability: {
          date,
        },
        isAvailable: true,
      },
      order: {
        seatNumber: 'ASC',
      },
    });
  }
}
