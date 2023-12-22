import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatEntity } from './seat.entity';
import { Repository } from 'typeorm';
import { DateEntity } from './date.entity';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(DateEntity)
    private dateRepository: Repository<DateEntity>,
    @InjectRepository(SeatEntity)
    private seatRepository: Repository<SeatEntity>,
  ) {}

  async getAvailableDates(): Promise<string[]> {
    const dates = await this.dateRepository
      .createQueryBuilder('date')
      .select('date.date')
      .innerJoin('date.seatAvailability', 'seat')
      .where('seat.isAvailable = true')
      .distinct(true)
      .orderBy('date.date', 'ASC')
      .getRawMany();

    return dates.map((v) => v.date_date);
  }

  async getAvailableSeatsByDate(date: string): Promise<number[]> {
    const seats = await this.seatRepository
      .createQueryBuilder('seat')
      .select('seat.seatNumber')
      .innerJoin('seat.dateAvailability', 'date')
      .where('date.date = :date', { date })
      .andWhere('seat.isAvailable = true')
      .orderBy('seat.seatNumber', 'ASC')
      .getRawMany();

    return seats.map((seat) => seat.seat_seatNumber);
  }
}
