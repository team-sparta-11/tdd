import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import {
  ReservationManager,
  ReservationReader,
} from 'src/reservation/reservation.handler';
import { UserManager } from 'src/auth/user.handler';
import { PaymentnManager } from './payment.handler';

const PRICE = 10000;

@Injectable()
export class PaymentService {
  constructor(
    private userManager: UserManager,
    private reservationManager: ReservationManager,
    private reservationReader: ReservationReader,
    private paymentManager: PaymentnManager,
  ) {}

  async chargeBalance({ user, amount }) {
    const currentBalance = user.balance;

    const newBalance = currentBalance + amount;

    const newUser = {
      ...user,
      balance: newBalance,
    };

    await this.userManager.save(newUser);

    return newBalance;
  }

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

    await this.reservationManager.save({
      ...reservation,
      paymentStatus: PAYMENT_STATUS.PAID,
    });

    await this.userManager.save({ ...user, balance: user.balance - PRICE });

    const payment = this.paymentManager.create({
      userId: user.id,
      amount: PRICE,
      paymentDate: new Date().toISOString(),
      status: PAYMENT_STATUS.PAID,
      reservationId,
    });

    await this.paymentManager.save(payment);

    return 'Reservation is done';
  }
}
