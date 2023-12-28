import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { Reservation } from './reservation.domain';
import { RequestReservationDto } from './dto/request-reservation.dto';
import { SeatManager, SeatReader } from 'src/seat/seat.handler';
import { Propagation, Transactional } from 'typeorm-transactional';
import { Seat } from 'src/seat/struct/seat.domain';
import { SeatEntity } from 'src/seat/struct/seat.entity';
import { ReservationEntity } from 'src/reservation/reservation.entity';

const FIVE_MINUTES = 5 * 60 * 1000;

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationManager: ReservationManager,
    private readonly reservationReader: ReservationReader,
    private readonly seatReader: SeatReader,
    private readonly seatManager: SeatManager,

    private readonly dataSource: DataSource,
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

    if (!seat) throw new BadRequestException('There is no seat');

    if (!seat.isAvailable) {
      throw new InternalServerErrorException('Seat is already reserved');
    }

    await this.seatManager.save({ ...seat, userId, isAvailable: false });

    const reservation = this.reservationManager.create({
      userId,
      seatNumber,
      date,
      paymentStatus: PAYMENT_STATUS.UNPAID,
      isExpired: false,
    });

    await this.reservationManager.save(reservation);

    // TODO: add schedule job after 5min

    return reservation;
  }

  // TODO: delete Transactional decorator if e2e module issue is not fixed
  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  async batchAfterReservation({
    seat,
    reservation,
  }: {
    seat: Seat;
    reservation: Reservation;
  }) {
    const afterReservation = await this.reservationReader.findOne(reservation);

    if (afterReservation.paymentStatus === PAYMENT_STATUS.UNPAID) {
      await this.seatManager.save({
        ...seat,
        userId: null,
        isAvailable: true,
      });
    }

    await this.reservationManager.save({
      ...reservation,
      isExpired: true,
    });
  }

  /** @TODO: this method is experimental for testing use real one  */
  async experimentalRequestReservation({
    userId,
    requestReservationDto,
  }: {
    userId: number;
    requestReservationDto: RequestReservationDto;
  }) {
    const { seatNumber, date } = requestReservationDto;

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');

      const manager = queryRunner.manager;

      const seat = await manager.findOne(SeatEntity, {
        where: {
          seatNumber,
          dateAvailability: { date },
        },
      });

      if (!seat) {
        throw new BadRequestException('There is no seat');
      }

      if (!seat.isAvailable) {
        throw new InternalServerErrorException('Seat is already reserved');
      }

      await manager.save(SeatEntity, { ...seat, userId, isAvailable: false });

      const reservation = manager.create(ReservationEntity, {
        userId,
        seatNumber,
        date,
        paymentStatus: PAYMENT_STATUS.UNPAID,
        isExpired: false,
      });

      await manager.save(ReservationEntity, reservation);

      return await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
