import { Test } from '@nestjs/testing';
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

const date = '2024-01-01';
const seatNumber = 1;

describe('reservation transaction', () => {
  let service: ReservationService;
  let dateResult: DateEntity;

  let em: EntityManager;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([SeatEntity, ReservationEntity]),
        TypeOrmModule.forRootAsync(typeORMAsyncConfig),
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

    dateResult = await em.save(DateEntity, {
      date,
    });
    await em.save(SeatEntity, {
      seatNumber,
      isAvailable: true,
      dateAvailability: dateResult,
    });
  });

  afterEach(async () => {
    await em.delete(SeatEntity, {});
    await em.delete(DateEntity, {});
    await em.delete(ReservationEntity, {});
  });

  it('Should reserve a one user when multiple users reservate same seat', async () => {
    const requestReservationDto = {
      date,
      seatNumber,
    };

    await Promise.all([
      service.experimentalRequestReservation({
        userId: 1,
        requestReservationDto: requestReservationDto,
      }),
      service.experimentalRequestReservation({
        userId: 2,
        requestReservationDto: requestReservationDto,
      }),
      service.experimentalRequestReservation({
        userId: 3,
        requestReservationDto: requestReservationDto,
      }),
      service.experimentalRequestReservation({
        userId: 4,
        requestReservationDto: requestReservationDto,
      }),
    ]);

    const res = await em.find(ReservationEntity);
    expect(res.length).toEqual(1);
  });

  it('Should not reserved when seat is not exist', async () => {
    const requestReservationDto = {
      date,
      seatNumber: 2,
    };

    await Promise.all([
      service.experimentalRequestReservation({
        userId: 1,
        requestReservationDto: requestReservationDto,
      }),
      service.experimentalRequestReservation({
        userId: 2,
        requestReservationDto: requestReservationDto,
      }),
      service.experimentalRequestReservation({
        userId: 3,
        requestReservationDto: requestReservationDto,
      }),
      service.experimentalRequestReservation({
        userId: 4,
        requestReservationDto: requestReservationDto,
      }),
    ]);

    const res = await em.find(ReservationEntity);
    expect(res.length).toEqual(0);
  });

  it('Should not reserved when seat is already used', async () => {
    await em.save(SeatEntity, {
      seatNumber: 3,
      isAvailable: false,
      dateAvailability: dateResult,
    });

    const requestReservationDto = {
      date,
      seatNumber: 3,
    };

    await Promise.all([
      service.experimentalRequestReservation({
        userId: 1,
        requestReservationDto: requestReservationDto,
      }),
      service.experimentalRequestReservation({
        userId: 2,
        requestReservationDto: requestReservationDto,
      }),
      service.experimentalRequestReservation({
        userId: 3,
        requestReservationDto: requestReservationDto,
      }),
      service.experimentalRequestReservation({
        userId: 4,
        requestReservationDto: requestReservationDto,
      }),
    ]);

    const res = await em.find(ReservationEntity);
    expect(res.length).toEqual(0);
  });
});
