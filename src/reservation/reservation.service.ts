import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { Reservation } from './struct/reservation.domain';
import { RequestReservationDto } from './struct/request-reservation.dto';
import { SeatManager, SeatReader } from 'src/seat/seat.handler';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationManager: ReservationManager,
    private readonly reservationReader: ReservationReader,
    private readonly seatReader: SeatReader,
    private readonly seatManager: SeatManager,
  ) {}

  @Transactional()
  async requestReservation({
    requestReservationDto,
    userId,
  }: {
    requestReservationDto: RequestReservationDto;
    userId: number;
  }): Promise<Reservation> {
    const { seatNumber, date } = requestReservationDto;

    const seat = await this.seatReader.getSeat({
      seatNumber,
      dateAvailability: { date },
    });

    const exists = await this.reservationReader.findOne({ seatNumber, date });

    if (!seat) throw new BadRequestException('There is no seat');

    if (seat.userId || exists) {
      throw new InternalServerErrorException('Seat is already reserved');
    }

    return await this.reservationManager.save({
      userId,
      seatNumber,
      date,
    });
  }
}
