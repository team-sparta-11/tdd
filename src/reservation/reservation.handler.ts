import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { ReservationEntity } from './struct/reservation.entity';
import { Reservation } from './struct/reservation.domain';
import { RedisClientService } from '../common/redis/redis.client-service';
import { plainToInstance } from 'class-transformer';

const FIVE_MINUTES = 5 * 60;

interface Command<T> {
  create(reservation: T): DeepPartial<T>;
  save(reservation: T): Promise<T>;
}

export class ReservationManager implements Command<Reservation> {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    private readonly redis: RedisClientService,
  ) {}

  create(reservation: DeepPartial<Reservation>): Reservation {
    return this.reservationRepository.create(reservation);
  }

  async save(reservation: DeepPartial<Reservation>): Promise<Reservation> {
    // return this.reservationRepository.save(reservation);
    this.redis.reservation.set(
      `reservation:${reservation.date}:${reservation.seatNumber}`,
      JSON.stringify(reservation),
    );

    this.redis.reservation.expire(
      `reservation:${reservation.userId}`,
      FIVE_MINUTES,
    );

    return reservation as Promise<Reservation>;
  }
}

interface Query<T> {
  findOne(reservation: DeepPartial<Reservation>): Promise<T | undefined>;
}

export class ReservationReader implements Query<Reservation> {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    private readonly redis: RedisClientService,
  ) {}

  async findOne(
    reservation: DeepPartial<Reservation>,
  ): Promise<Reservation | undefined> {
    // return this.reservationRepository.findOne({ where: reservation });
    const json = JSON.parse(
      await this.redis.reservation.get(
        `reservation:${reservation.date}:${reservation.seatNumber}`,
      ),
    );

    return plainToInstance(ReservationEntity, json) as unknown as Reservation;
  }
}
