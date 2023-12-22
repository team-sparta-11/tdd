import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { SeatEntity } from 'src/seat/seat.entity';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { Reservation } from './reservation.domain';
import { RequestReservationDto } from './dto/request-reservation.dto';

const FIVE_MINUTES = 5 * 60 * 1000;

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationManager: ReservationManager,
    private readonly reservationReader: ReservationReader,

    @InjectRepository(SeatEntity)
    private seatRepository: Repository<SeatEntity>,
  ) {}

  async requestReservation({
    requestReservationDto,
    userId,
  }: {
    requestReservationDto: RequestReservationDto;
    userId: number;
  }): Promise<Reservation> {
    const { seatNumber, date } = requestReservationDto;

    const seat = await this.seatRepository.findOne({
      where: { seatNumber, dateAvailability: { date } },
    });

    if (!seat) throw new BadRequestException('There is no seat');

    if (!seat.isAvailable) {
      throw new InternalServerErrorException('Seat is already reserved');
    }

    await this.seatRepository.save({ ...seat, userId, isAvailable: false });

    const reservation = this.reservationManager.create({
      userId,
      seatNumber,
      date,
      paymentStatus: PAYMENT_STATUS.UNPAID,
      isExpired: false,
    });

    await this.reservationManager.save(reservation);

    setTimeout(async () => {
      const afterReservation = await this.reservationReader.findOne({
        userId,
        seatNumber,
        date,
      });

      if (afterReservation.paymentStatus === PAYMENT_STATUS.UNPAID) {
        await this.seatRepository.save({
          ...seat,
          userId: null,
          isAvailable: true,
        });
      }

      await this.reservationManager.save({
        ...reservation,
        isExpired: true,
      });
    }, FIVE_MINUTES);

    return reservation;
  }
}
