import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityNotFoundError, Repository } from 'typeorm';

import { SeatEntity } from './struct/seat.entity';
import { Seat } from './struct/seat.domain';
import { NotFoundException } from '@nestjs/common';

interface Query<T> {
  getAvailableSeatByDate(date: string): Promise<number[]>;
  findOne(seatInfo: DeepPartial<T>): Promise<T>;
}

export class SeatReader implements Query<Seat> {
  constructor(
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
  ) {}

  async findOne(seatInfo: DeepPartial<Seat>): Promise<Seat> {
    // TODO: extract to catch filter(APO)
    try {
      return await this.seatRepository.findOneOrFail({ where: seatInfo });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException('NotMatchSeatExists');
      } else {
        throw e;
      }
    }
  }

  async getAvailableSeatByDate(date: string): Promise<number[]> {
    const seats = await this.seatRepository
      .createQueryBuilder('seat')
      .leftJoinAndSelect('seat.date', 'date')
      .where('seat.date = :date', { date })
      .andWhere('seat.userId IS NULL')
      .orderBy('seat.seatNumber', 'ASC')
      .getMany();

    return seats.map((seat) => seat.seatNumber);
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
