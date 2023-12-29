import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ReservationEntity } from './struct/reservation.entity';
import { Reservation } from './struct/reservation.domain';
import { RedisClientService } from '../common/redis/redis.client-service';
import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';

const FIVE_MINUTES = 5 * 60;

/**
 * @description
 *
 * currently, reservation is now write to redis, and read from redis.
 * Write Relational Data Base, only for history.
 * */

interface Command<T> {
  save(reservation: T): Promise<T>;
  savePermanent(reservation: T): Promise<T>;
}

@Injectable()
export class ReservationManager implements Command<Reservation> {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly reservationRepository: Repository<ReservationEntity>,
    private readonly redis: RedisClientService,
  ) {}

  async save(reservation: DeepPartial<Reservation>): Promise<Reservation> {
    // return this.reservationRepository.save(reservation);
    this.redis.reservation.set(
      `reservation:${reservation.date}:${reservation.seatNumber}`,
      JSON.stringify(reservation),
    );

    // save reservation with expired time.
    // thx to this function,
    // we don't need schedule for expired unpaid reservation
    this.redis.reservation.expire(
      `reservation:${reservation.date}:${reservation.seatNumber}`,
      FIVE_MINUTES,
    );

    return reservation as Promise<Reservation>;
  }

  async savePermanent(
    reservation: DeepPartial<Reservation>,
  ): Promise<Reservation> {
    return this.reservationRepository.save(reservation);
  }
}

interface Query<T> {
  findOne(reservation: DeepPartial<Reservation>): Promise<T | undefined>;
}

@Injectable()
export class ReservationReader implements Query<Reservation> {
  constructor(private readonly redis: RedisClientService) {}

  async findOne(
    reservation: DeepPartial<Reservation>,
  ): Promise<Reservation | undefined> {
    const json = JSON.parse(
      await this.redis.reservation.get(
        `reservation:${reservation.date}:${reservation.seatNumber}`,
      ),
    );

    return plainToInstance(ReservationEntity, json) as unknown as Reservation;
  }
}
