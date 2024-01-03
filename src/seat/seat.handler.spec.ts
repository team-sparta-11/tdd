import { Test, TestingModule } from '@nestjs/testing';
import { SeatReader, SeatManager } from './seat.handler';
import { Repository } from 'typeorm';
import { SeatEntity } from './struct/seat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('SeatReader and SeatManager', () => {
  let seatReader: SeatReader;
  let seatManager: SeatManager;
  let seatRepository: Repository<SeatEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatReader,
        SeatManager,
        {
          provide: getRepositoryToken(SeatEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    seatReader = module.get<SeatReader>(SeatReader);
    seatManager = module.get<SeatManager>(SeatManager);
    seatRepository = module.get<Repository<SeatEntity>>(
      getRepositoryToken(SeatEntity),
    );
  });

  const mockSeatInfo = {
    seatNumber: 1,
    dateAvailability: { date: '2024-01-01' },
  };
  const mockSeat = {
    id: 1,
    seatNumber: 1,
    userId: null,
  };

  it('should find a seat by seatInfo', async () => {
    const findSpy = jest
      .spyOn(seatRepository, 'findOneOrFail')
      .mockResolvedValue(mockSeat as SeatEntity);

    const result = await seatReader.findOne(mockSeatInfo);

    expect(findSpy).toHaveBeenCalledWith({
      where: mockSeatInfo,
    });
    expect(result).toEqual(mockSeat);
  });

  it('should find available seats by date', async () => {
    const mockDate = '2024-01-01';
    const mockAvailableSeats: Partial<SeatEntity>[] = [mockSeat];

    const findSpy = jest
      .spyOn(seatRepository, 'find')
      .mockResolvedValue(mockAvailableSeats as SeatEntity[]);

    const result = await seatReader.getAvailableSeatByDate(mockDate);

    expect(findSpy).toHaveBeenCalledWith({
      relations: ['date'],
      where: {
        date: mockDate,
        userId: null,
      },
      order: {
        seatNumber: 'ASC',
      },
    });

    const expectedSeat = mockAvailableSeats.map((seat) => seat.seatNumber);
    expect(result).toEqual(expectedSeat as number[]);
  });

  it('should save a seat', async () => {
    const mockSavedSeat = {
      ...mockSeat,
      userId: 1,
    };

    const saveSpy = jest
      .spyOn(seatRepository, 'save')
      .mockResolvedValue(mockSavedSeat as SeatEntity);

    const result = await seatManager.save(mockSeat as SeatEntity);

    expect(saveSpy).toHaveBeenCalledWith(mockSeat);
    expect(result).toEqual(mockSavedSeat);
  });
});
