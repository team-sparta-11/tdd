import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import {
  ReservationManager,
  ReservationReader,
} from 'src/reservation/reservation.handler';
import { UserManager } from 'src/auth/user.handler';
import { PaymentManager } from './payment.handler';
import { Transactional } from 'typeorm-transactional';
import { EventEmitter2 } from '@nestjs/event-emitter';

export const PRICE = 10000;

@Injectable()
export class PaymentService {
  constructor(
    private userManager: UserManager,
    private reservationManager: ReservationManager,
    private reservationReader: ReservationReader,
    private paymentManager: PaymentManager,
    private eventEmitter: EventEmitter2,
  ) {}

  async chargeBalance({ user, amount }) {
    const newUser = {
      ...user,
      balance: user.balance + amount,
    };

    await this.userManager.save(newUser);

    return newUser.balance;
  }

  @Transactional()
  async payReservation({ user, reservationId }) {
    if (user.balance < PRICE) {
      throw new InternalServerErrorException('Balance is not enough to pay');
    }

    const reservation = await this.reservationReader.findOne({
      id: reservationId,
    });

    if (!reservation) {
      throw new InternalServerErrorException('Reservation is not on list');
    }

    if (reservation.isExpired) {
      throw new InternalServerErrorException('Reservation is expired');
    }

    const updatedReservation = {
      ...reservation,
      paymentStatus: PAYMENT_STATUS.PAID,
    };

    await this.reservationManager.save(updatedReservation);

    await this.userManager.save({ ...user, balance: user.balance - PRICE });

    const payment = this.paymentManager.create({
      userId: user.id,
      amount: PRICE,
      paymentDate: new Date().toISOString(),
      status: PAYMENT_STATUS.PAID,
      reservationId,
    });

    await this.paymentManager.save(payment);

    this.eventEmitter.emit('task.done', { token: user['statusToken'] });

    return payment;
  }
}
