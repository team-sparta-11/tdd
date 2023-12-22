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
    const availableDates = await this.dateRepository.find({
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

    return availableDates.map((date) => date.date);
  }

  async getAvailableSeatsByDate(date: string): Promise<number[]> {
    const availableSeats = await this.seatRepository.find({
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

    return availableSeats.map((seat) => seat.seatNumber);
  }
}
