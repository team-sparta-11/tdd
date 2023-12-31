import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { ReservationReader } from 'src/reservation/reservation.handler';
import { UserManager } from 'src/auth/user.handler';
import { PaymentManager } from './payment.handler';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SeatManager } from '../seat/seat.handler';
import { DataSource } from 'typeorm';

export const PRICE = 10000;

@Injectable()
export class PaymentService {
  constructor(
    private userManager: UserManager,
    private reservationReader: ReservationReader,
    private paymentManager: PaymentManager,
    private seatManager: SeatManager,
    private eventEmitter: EventEmitter2,
    private dataSource: DataSource,
  ) {}

  async chargeBalance({ user, amount }) {
    const newUser = {
      ...user,
      balance: user.balance + amount,
    };

    await this.userManager.save(newUser);

    return newUser.balance;
  }

  async payReservation({ user, seatNumber, date }) {
    if (user.balance < PRICE) {
      throw new NotAcceptableException('Balance is not enough to pay');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');

      // find reservation from memory database
      const reservation = await this.reservationReader.findOne({
        seatNumber,
        date,
      });

      // check reservation owner
      if (!reservation || reservation.userId !== user.id) {
        throw new NotFoundException('Reservation is not on list or expired');
      }

      // seat taken
      await this.seatManager.update(user.id, seatNumber, date);

      // update balance
      // TODO: is really ok, balance locate on user entity directly?
      await this.userManager.save({ ...user, balance: user.balance - PRICE });

      const payment = this.paymentManager.create({
        userId: user.id,
        amount: PRICE,
        paymentDate: new Date().toISOString(),
        status: PAYMENT_STATUS.PAID,
      });

      // event for other persist
      // - 1. task queue progress - memory db
      // - 2. save payment history - rdb
      // - 3. save reservation history - rdb
      // listeners
      // - in waiting module
      // - in payment module
      // - in reservation module
      this.eventEmitter.emit('task.done', {
        token: user['statusToken'],
        payment,
        reservation: {
          userId: user.id,
          date,
          seatNumber,
        },
      });

      await queryRunner.commitTransaction();

      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
