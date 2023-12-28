import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { SeatEntity } from './struct/seat.entity';
import { Seat } from './struct/seat.domain';

interface Query<T> {
  getSeat(seatInfo: DeepPartial<T>): Promise<T>;
  getAvailableSeatByDate(date: string): Promise<number[]>;
}

export class SeatReader implements Query<Seat> {
  constructor(
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
  ) {}

  getSeat(seatInfo: DeepPartial<Seat>): Promise<Seat> {
    return this.seatRepository.findOne({ where: seatInfo });
  }

  async getAvailableSeatByDate(date: string): Promise<number[]> {
    const seats = await this.seatRepository.find({
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

    return seats.map((seat) => seat.seatNumber);
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
