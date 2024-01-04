import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ReservationEntity } from './struct/reservation.entity';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { RedisClientService } from '../common/redis/redis.client-service';
import { ChainableCommander } from 'ioredis';
import { createMock } from '@golevelup/ts-jest';

const fakeReservation = {
  userId: 1,
  date: '2024-01-01',
  seatNumber: 1,
};

const mockRedis = {
  set: (
    // _key: string,
    // _value: unknown,
    // _expireFlag: 'EX',
    // _expireSeconds: number,
    // _transactionFlag: 'NX',
    ..._args: any[]
  ) => ({ exec: jest.fn() }),
  get: () => fakeReservation,
};

describe('ReservationManager and ReservationReader', () => {
  let reservationManager: ReservationManager;
  let reservationReader: ReservationReader;
  let reservationRepository: Repository<ReservationEntity>;
  let redisClient: RedisClientService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReservationManager,
        ReservationReader,
        {
          provide: getRepositoryToken(ReservationEntity),
          useClass: Repository,
        },
        RedisClientService,
      ],
    })
      .useMocker(createMock)
      .compile();

    reservationManager = moduleRef.get<ReservationManager>(ReservationManager);
    reservationReader = moduleRef.get<ReservationReader>(ReservationReader);
    reservationRepository = moduleRef.get<Repository<ReservationEntity>>(
      getRepositoryToken(ReservationEntity),
    );
    redisClient = moduleRef.get<RedisClientService>(RedisClientService);
  });

  it('should save a reservation', async () => {
    const updatedReservation = {
      ...fakeReservation,
      paymentStatus: PAYMENT_STATUS.PAID,
    };

    jest
      .spyOn(redisClient.reservation, 'get')
      .mockResolvedValueOnce(JSON.stringify(fakeReservation));

    const saveSpy = jest
      .spyOn(redisClient.reservation, 'multi')
      .mockReturnValueOnce(mockRedis as unknown as ChainableCommander);

    const result = await reservationManager.save(updatedReservation);

    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual(updatedReservation);
  });

  it('should find a reservation', async () => {
    const findSpy = jest
      .spyOn(redisClient.reservation, 'get')
      .mockResolvedValueOnce(JSON.stringify(fakeReservation));

    const result = await reservationReader.findOne(fakeReservation);

    expect(findSpy).toHaveBeenCalledWith(
      `reservation:${fakeReservation.date}:${fakeReservation.userId}`,
    );
    expect(result).toEqual(fakeReservation);
  });
});
