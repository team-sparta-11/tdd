import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { ReservationEntity } from './reservation.entity';
import { Reservation } from './reservation.domain';

interface Command<T> {
  create(reservation: T): DeepPartial<T>;
  save(reservation: T): Promise<T>;
}

export class ReservationManager implements Command<Reservation> {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  create(reservation: DeepPartial<Reservation>): Reservation {
    return this.reservationRepository.create(reservation);
  }

  async save(reservation: DeepPartial<Reservation>): Promise<Reservation> {
    return this.reservationRepository.save(reservation);
  }
}

interface Query<T> {
  findOne(reservation: DeepPartial<Reservation>): Promise<T | undefined>;
}

export class ReservationReader implements Query<Reservation> {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
  ) {}

  async findOne(
    reservation: DeepPartial<Reservation>,
  ): Promise<Reservation | undefined> {
    return this.reservationRepository.findOne({ where: reservation });
  }
}
