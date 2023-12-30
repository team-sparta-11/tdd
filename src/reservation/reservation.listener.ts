import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReservationManager } from './reservation.handler';

@Injectable()
export class ReservationListener {
  constructor(private readonly manager: ReservationManager) {}

  @OnEvent('task.done')
  handleReservationHistory({
    reservation,
  }: {
    reservation: {
      userId: number;
      date: string;
      seatNumber: number;
    };
  }) {
    return this.manager.savePermanent(reservation);
  }
}
