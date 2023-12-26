import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PAYMENT_STATUS } from 'src/common/types/reservation';

const fakeReservation = {
  id: 1,
  userId: 1,
  date: '2024-01-01',
  seatNumber: 1,
  isExpired: false,
  paymentStatus: PAYMENT_STATUS.UNPAID,
};

describe('ReservationManager and ReservationReader', () => {
  let reservationManager: ReservationManager;
  let reservationReader: ReservationReader;
  let reservationRepository: Repository<ReservationEntity>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ReservationManager,
        ReservationReader,
        {
          provide: getRepositoryToken(ReservationEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    reservationManager = moduleRef.get<ReservationManager>(ReservationManager);
    reservationReader = moduleRef.get<ReservationReader>(ReservationReader);
    reservationRepository = moduleRef.get<Repository<ReservationEntity>>(
      getRepositoryToken(ReservationEntity),
    );
  });

  it('should create a reservation', () => {
    jest
      .spyOn(reservationRepository, 'create')
      .mockReturnValue(fakeReservation as ReservationEntity);

    const result = reservationManager.create(fakeReservation);

    expect(reservationRepository.create).toHaveBeenCalled();
    expect(reservationRepository.create).toHaveBeenCalledWith(fakeReservation);
    expect(result).toEqual(fakeReservation);
  });

  it('should save a reservation', async () => {
    const updatedReservation = {
      ...fakeReservation,
      paymentStatus: PAYMENT_STATUS.PAID,
    };

    jest
      .spyOn(reservationRepository, 'save')
      .mockResolvedValue(updatedReservation as ReservationEntity);

    const result = await reservationManager.save(updatedReservation);

    expect(reservationRepository.save).toHaveBeenCalledWith(updatedReservation);
    expect(result).toEqual(updatedReservation);
  });

  it('should find a reservation', async () => {
    const partialReservation = { id: 1 };

    jest
      .spyOn(reservationRepository, 'findOne')
      .mockResolvedValue(fakeReservation as ReservationEntity);

    const result = await reservationReader.findOne(partialReservation);

    expect(reservationRepository.findOne).toHaveBeenCalledWith({
      where: partialReservation,
    });
    expect(result).toEqual(fakeReservation);
  });
});
