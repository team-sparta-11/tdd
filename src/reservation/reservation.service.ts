import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
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

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');

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
      const reservation = await this.reservationManager.save({
        userId,
        seatNumber,
        date,
      });

      await queryRunner.commitTransaction();

      return reservation;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
