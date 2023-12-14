import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { ReservationEntity } from 'src/reservation/reservation.entity';
import { PAYMENT_STATUS } from 'src/types/reservation';
import { PaymentEntity } from './payment.entity';

const PRICE = 10000;

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ReservationEntity)
    private reservationRepository: Repository<ReservationEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
  ) {}

  async chargeBalance({ user, amount }) {
    const currentBalance = user.balance;

    const newBalance = currentBalance + amount;

    const newUser = {
      ...user,
      balance: newBalance,
    };

    await this.userRepository.save(newUser);

    return newBalance;
  }

  async payReservation({ user, reservationId }) {
    if (user.balance < PRICE) {
      throw new InternalServerErrorException('Balance is not enough to pay');
    }

    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
    });

    if (!reservation) {
      throw new InternalServerErrorException('Reservation is not on list');
    }

    if (reservation.isExpired) {
      throw new InternalServerErrorException('Reservation is expired');
    }

    await this.reservationRepository.save({
      ...reservation,
      paymentStatus: PAYMENT_STATUS.PAID,
    });

    await this.userRepository.save({ ...user, balance: user.balance - PRICE });

    const payment = this.paymentRepository.create({
      userId: user.id,
      amount: PRICE,
      paymentDate: new Date().toISOString(),
      status: PAYMENT_STATUS.PAID,
      reservationId,
    });

    await this.paymentRepository.save(payment);

    return 'Reservation is done';
  }
}
