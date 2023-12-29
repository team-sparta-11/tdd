import { Test, TestingModule } from '@nestjs/testing';
import { SeatService } from './seat.service';
import { SeatReader } from './seat.handler';

describe('SeatService', () => {
  let service: SeatService;
  let reader: SeatReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatService,
        {
          provide: SeatReader,
          useValue: {
            getAvailableSeatByDate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SeatService>(SeatService);
    reader = module.get<SeatReader>(SeatReader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get available seat by date correctly', async () => {
    const date = '2024-01-01';
    const seats = [1, 2, 3, 4, 5];

    const getAvailableSeatSpy = jest
      .spyOn(reader, 'getAvailableSeatByDate')
      .mockResolvedValue(seats);

    const result = await service.getAvailableSeatsByDate(date);

    expect(result).toEqual(seats);
    expect(getAvailableSeatSpy).toHaveBeenCalledWith(date);
  });
});
