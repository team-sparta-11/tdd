import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { SeatEntity } from './struct/seat.entity';
import { Seat } from './struct/seat.domain';

interface Query<T> {
  getAvailableSeatByDate(date: string): Promise<T[]>;
  getSeat(seatInfo: DeepPartial<T>): Promise<T>;
}

export class SeatReader implements Query<Seat> {
  constructor(
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
  ) {}

  getSeat(seatInfo: DeepPartial<Seat>): Promise<Seat> {
    return this.seatRepository.findOne({ where: seatInfo });
  }

  getAvailableSeatByDate(date: string): Promise<Seat[]> {
    return this.seatRepository.find({
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

interface Command<T> {
  save(user: T): Promise<T>;
}
export class SeatManager implements Command<Seat> {
  constructor(
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
  ) {}

  async save(seat: Seat): Promise<Seat> {
    return this.seatRepository.save(seat);
  }
}
