import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { Reservation } from './struct/reservation.domain';
import { RequestReservationDto } from './struct/request-reservation.dto';
import { SeatManager, SeatReader } from 'src/seat/seat.handler';
import { Propagation, Transactional } from 'typeorm-transactional';
import { Seat } from 'src/seat/struct/seat.domain';
import { SeatEntity } from 'src/seat/struct/seat.entity';
import { ReservationEntity } from 'src/reservation/struct/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationManager: ReservationManager,
    private readonly reservationReader: ReservationReader,
    private readonly seatReader: SeatReader,
    private readonly seatManager: SeatManager,

    private readonly dataSource: DataSource,
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

      return await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
