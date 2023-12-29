import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { SeatEntity } from './struct/seat.entity';
import { Seat } from './struct/seat.domain';

interface Query<T> {
  getAvailableSeatByDate(date: string): Promise<T[]>;
  findOne(seatInfo: DeepPartial<T>): Promise<T>;
}

export class SeatReader implements Query<Seat> {
  constructor(
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
  ) {}

  findOne(seatInfo: DeepPartial<Seat>): Promise<Seat> {
    return this.seatRepository.findOneOrFail({ where: seatInfo });
  }

  getAvailableSeatByDate(date: string): Promise<Seat[]> {
    return this.seatRepository.find({
      relations: ['date'],
      where: {
        date: date,
        userId: null,
      },
      order: {
        seatNumber: 'ASC',
      },
    });
  }
}

interface Command<T> {
  save(user: T): Promise<T>;
  update(userId: number, seatNumber: number, date: string): Promise<unknown>;
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
    return this.seatRepository.update({ seatNumber, date: date }, { userId });
  }
}
