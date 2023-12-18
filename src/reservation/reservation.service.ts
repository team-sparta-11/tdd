import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from './reservation.entity';
import { Repository } from 'typeorm';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { SeatEntity } from 'src/seat/seat.entity';

const FIVE_MINUTES = 5 * 60 * 1000;

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(SeatEntity)
    private seatRepository: Repository<SeatEntity>,
  ) {}

  async requestReservation({
    requestReservationDto,
    user,
  }): Promise<ReservationEntity> {
    const { seatNumber, date } = requestReservationDto;
    const { id: userId } = user;

    const seat = await this.seatRepository.findOne({
      where: { seatNumber, dateAvailability: { date } },
    });

    if (!seat) throw new BadRequestException('There is no seat');

    if (!seat.isAvailable) {
      throw new InternalServerErrorException('Seat is already reserved');
    }

    await this.seatRepository.save({ ...seat, userId, isAvailable: false });

    const reservation = this.reservationRepository.create({
      userId,
      seatNumber,
      date,
      paymentStatus: PAYMENT_STATUS.UNPAID,
      isExpired: false,
    });

    await this.reservationRepository.save(reservation);

    setTimeout(async () => {
      const afterReservation = await this.reservationRepository.findOne({
        where: { userId, seatNumber, date },
      });

      if (afterReservation.paymentStatus === PAYMENT_STATUS.UNPAID) {
        await this.seatRepository.save({
          ...seat,
          userId: null,
          isAvailable: true,
        });
      }

      await this.reservationRepository.save({
        ...reservation,
        isExpired: true,
      });
    }, FIVE_MINUTES);

    return reservation;
  }
}
