import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartial, Repository } from 'typeorm';
import { ReservationEntity } from './struct/reservation.entity';
import { Reservation } from './struct/reservation.domain';
import { RedisClientService } from '../common/redis/redis.client-service';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { getRepositoryToken } from '@nestjs/typeorm';

const FIVE_MINUTES = 5 * 60;

const mockReservationDto: DeepPartial<Reservation> = {
  date: '2024-01-01',
  seatNumber: 1,
};

describe('ReservationManager', () => {
  let reservationManager: ReservationManager;
  let reservationRepository: Repository<ReservationEntity>;
  let redisClientService: RedisClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationManager,
        ReservationReader,
        RedisClientService,
        {
          provide: getRepositoryToken(ReservationEntity),
          useClass: Repository,
        },
        {
          provide: RedisClientService,
          useValue: {
            reservation: {
              set: jest.fn(),
              expire: jest.fn(),
              get: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    reservationManager = module.get<ReservationManager>(ReservationManager);
    redisClientService = module.get<RedisClientService>(RedisClientService);
    reservationRepository = module.get<Repository<ReservationEntity>>(
      getRepositoryToken(ReservationEntity),
    );
  });

  it('should save reservation to Redis and set expiration', async () => {
    const setSpy = jest
      .spyOn(redisClientService.reservation, 'set')
      .mockResolvedValue('OK');
    const expireSpy = jest
      .spyOn(redisClientService.reservation, 'expire')
      .mockResolvedValue(1);

    const result = await reservationManager.save(mockReservationDto);

    expect(setSpy).toHaveBeenCalledWith(
      expect.any(String),
      JSON.stringify(mockReservationDto),
    );
    expect(expireSpy).toHaveBeenCalledWith(expect.any(String), FIVE_MINUTES);
    expect(result).toEqual(mockReservationDto);
  });

  it('should save reservation to DB', async () => {
    const savedReservation = {
      ...mockReservationDto,
      id: 1,
    };
    const saveSpy = jest
      .spyOn(reservationRepository, 'save')
      .mockResolvedValue(savedReservation as ReservationEntity);

    const result = await reservationManager.savePermanent(mockReservationDto);

    expect(saveSpy).toHaveBeenCalledWith(mockReservationDto);
    expect(result).toEqual(savedReservation);
  });
});

describe('ReservationReader', () => {
  let reservationReader: ReservationReader;
  let redisClientService: RedisClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationManager,
        ReservationReader,
        RedisClientService,
        {
          provide: getRepositoryToken(ReservationEntity),
          useClass: Repository,
        },
        {
          provide: RedisClientService,
          useValue: {
            reservation: {
              get: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    reservationReader = module.get<ReservationReader>(ReservationReader);
    redisClientService = module.get<RedisClientService>(RedisClientService);
  });

  it('should read reservation from Redis', async () => {
    const foundReservation = {
      id: 1,
      ...mockReservationDto,
    };

    const getSpy = jest
      .spyOn(redisClientService.reservation, 'get')
      .mockResolvedValue(JSON.stringify(foundReservation));

    const result = await reservationReader.findOne(mockReservationDto);

    expect(getSpy).toHaveBeenCalledWith(expect.any(String));
    expect(result).toEqual(foundReservation);
  });
});
