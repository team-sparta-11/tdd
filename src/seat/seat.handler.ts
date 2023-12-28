import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { SeatEntity } from './struct/seat.entity';
import { Seat } from './struct/seat.domain';
import { DateEntity } from '../date/struct/date.entity';
import { Date } from '../date/struct/date.domain';

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
      },
      order: {
        seatNumber: 'ASC',
      },
    });
  }
}

interface Command<T> {
  save(user: T): Promise<T>;
  update(userId: number, seatNumber: number, date: string);
}
export class SeatManager implements Command<Seat> {
  constructor(
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
  ) {}

  async save(seat: Seat): Promise<Seat> {
    return this.seatRepository.save(seat);
  }

  async update(userId: number, seatNumber: number, date: string) {
    console.log(
      await this.seatRepository.update(
        { seatNumber, dateAvailability: { date } },
        { userId },
      ),
    );
    return this.seatRepository.update(
      { seatNumber, dateAvailability: { date } },
      { userId },
    );
  }
}
