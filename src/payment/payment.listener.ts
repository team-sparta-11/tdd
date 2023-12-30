import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Payment } from './struct/payment.domain';
import { PaymentManager } from './payment.handler';

@Injectable()
export class PaymentListener {
  constructor(private readonly manager: PaymentManager) {}

  @OnEvent('task.done')
  handleUserPaid(payment: Payment) {
    return this.manager.save(payment);
  }
}
