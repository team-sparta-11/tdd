import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatEntity } from 'src/seat/struct/seat.entity';
import { ReservationEntity } from './struct/reservation.entity';
import { ReservationService } from './reservation.service';
import { typeORMAsyncConfig } from 'src/common/config/typeorm.config';
import { ReservationModule } from './reservation.module';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { SeatManager, SeatReader } from 'src/seat/seat.handler';
import { EntityManager } from 'typeorm';
import { DateEntity } from 'src/date/struct/date.entity';
import { RedisClientModule } from '../common/redis/redis.client-module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOption } from '../common/config/app.config';
import { RedisClientService } from '../common/redis/redis.client-service';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';

const date = '2024-01-01';
const seatNumber = 1;

describe('reservation transaction', () => {
  let module: TestingModule;

  let service: ReservationService;

  let em: EntityManager;
  let rc: RedisClientService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(configModuleOption),
        TypeOrmModule.forFeature([SeatEntity, ReservationEntity]),
        TypeOrmModule.forRootAsync(typeORMAsyncConfig),
        RedisClientModule,
        ReservationModule,
      ],
      providers: [
        ReservationService,
        ReservationManager,
        ReservationReader,
        SeatManager,
        SeatReader,
      ],
    }).compile();

    service = module.get(ReservationService);
    em = module.get(EntityManager);
    rc = module.get(RedisClientService);

    await em.save(DateEntity, {
      date,
    });

    await em.save(SeatEntity, {
      seatNumber,
      date,
    });
  });

  afterEach(async () => {
    await em.delete(SeatEntity, {});
    await em.delete(DateEntity, {});
    await em.delete(ReservationEntity, {});

    await module.close();
  });

  it('Should reserve a one user when multiple users reservate same seat', async () => {
    const requestReservationDto = {
      date,
      seatNumber,
    };

    await expect(async () => {
      await Promise.all([
        service.requestReservation({
          userId: 1,
          requestReservationDto: requestReservationDto,
        }),
        service.requestReservation({
          userId: 2,
          requestReservationDto: requestReservationDto,
        }),
        service.requestReservation({
          userId: 3,
          requestReservationDto: requestReservationDto,
        }),
        service.requestReservation({
          userId: 4,
          requestReservationDto: requestReservationDto,
        }),
      ]);
    }).rejects.toThrow(new NotAcceptableException('Seat is already taken'));

    const res = JSON.parse(
      await rc.reservation.get(
        `reservation:${requestReservationDto.date}:${requestReservationDto.seatNumber}`,
      ),
    );

    expect(res.userId).toEqual(1);
  });

  it('Should not reserved when seat is not exist', async () => {
    const requestReservationDto = {
      date,
      seatNumber: 2,
    };

    await expect(async () => {
      await Promise.all([
        service.requestReservation({
          userId: 1,
          requestReservationDto: requestReservationDto,
        }),
        service.requestReservation({
          userId: 2,
          requestReservationDto: requestReservationDto,
        }),
        service.requestReservation({
          userId: 3,
          requestReservationDto: requestReservationDto,
        }),
        service.requestReservation({
          userId: 4,
          requestReservationDto: requestReservationDto,
        }),
      ]);
    }).rejects.toThrow(new NotFoundException('NotMatchSeatExists'));

    const res = JSON.parse(
      await rc.reservation.get(
        `reservation:${requestReservationDto.date}:${requestReservationDto.seatNumber}`,
      ),
    );

    expect(res).toEqual(null);
  });

  it('Should not reserved when seat is already used', async () => {
    await em.save(SeatEntity, {
      seatNumber: 3,
      userId: 1111,
      date,
    });

    await rc.reservation.set(
      `reservation:${date}:3`,
      JSON.stringify({
        userId: 1111,
        seatNumber: 3,
        date,
      }),
    );

    const requestReservationDto = {
      date,
      seatNumber: 3,
    };

    await expect(async () => {
      await Promise.all([
        service.requestReservation({
          userId: 1,
          requestReservationDto: requestReservationDto,
        }),
        service.requestReservation({
          userId: 2,
          requestReservationDto: requestReservationDto,
        }),
        service.requestReservation({
          userId: 3,
          requestReservationDto: requestReservationDto,
        }),
        service.requestReservation({
          userId: 4,
          requestReservationDto: requestReservationDto,
        }),
      ]);
    }).rejects.toThrow(new NotAcceptableException('Seat is already taken'));

    const res = JSON.parse(await rc.reservation.get(`reservation:${date}:3`));

    expect([1, 2, 3, 4].includes(res.userId)).toBeFalsy();
  });
});
