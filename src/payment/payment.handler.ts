import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { PaymentEntity } from './struct/payment.entity';
import { Payment } from './struct/payment.domain';

interface Command<T> {
  create(reservation: T): DeepPartial<T>;
  save(reservation: T): Promise<T>;
}

export class PaymentManager implements Command<Payment> {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  create(reservation: DeepPartial<Payment>): Payment {
    return this.paymentRepository.create(reservation);
  }

  async save(reservation: DeepPartial<Payment>): Promise<Payment> {
    return this.paymentRepository.save(reservation);
  }
}
