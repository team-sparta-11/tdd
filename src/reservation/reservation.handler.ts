import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ReservationEntity } from './struct/reservation.entity';
import { Reservation } from './struct/reservation.domain';
import { RedisClientService } from '../common/redis/redis.client-service';
import { plainToInstance } from 'class-transformer';
import { Injectable, NotAcceptableException } from '@nestjs/common';

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
    const key = `reservation:${reservation.date}:${reservation.seatNumber}`;

    await this.redis.reservation
      // start redis transaction
      .multi()
      // EX mean expire second
      // NX mean not updatable
      .set(key, JSON.stringify(reservation), 'EX', FIVE_MINUTES, 'NX')
      .exec();

    // if date-seat has already in redis, not changed.
    // else, new insert has made just before.
    // check user id and throw again.
    const result = JSON.parse(await this.redis.reservation.get(key));
    if (result['userId'] !== reservation.userId)
      throw new NotAcceptableException('Seat is already taken');

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
    const key = `reservation:${reservation.date}:${reservation.seatNumber}`;

    return plainToInstance(
      ReservationEntity,
      JSON.parse(await this.redis.reservation.get(key)),
    ) as unknown as Reservation;
  }
}
