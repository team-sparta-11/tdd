import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { Reservation } from './struct/reservation.domain';
import { RequestReservationDto } from './struct/request-reservation.dto';
import { SeatReader } from 'src/seat/seat.handler';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationManager: ReservationManager,
    private readonly reservationReader: ReservationReader,
    private readonly seatReader: SeatReader,
  ) {}

  async requestReservation({
    requestReservationDto,
    userId,
  }: {
    requestReservationDto: RequestReservationDto;
    userId: number;
  }): Promise<Reservation> {
    const { seatNumber, date } = requestReservationDto;

    // seat information
    const seat = await this.seatReader.findOne({
      seatNumber,
      date,
    });

    // reservation from memory database
    const exists = await this.reservationReader.findOne({ seatNumber, date });

    // When user already reservation or paid,
    // just return already information
    if (exists?.userId === userId || seat?.userId === userId)
      return {
        userId,
        seatNumber,
        date,
      };

    // When seat already has userId (=== paid on other user)
    // throw
    if (seat?.userId) {
      throw new InternalServerErrorException('Seat is already taken');
    }

    // reserve to memory database
    return await this.reservationManager.save({
      userId,
      seatNumber,
      date,
    });
  }
}
