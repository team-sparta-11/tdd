import { Test, TestingModule } from '@nestjs/testing';
import { DateService } from './date.service';
import { DateReader } from './date.handler';

describe('DateService', () => {
  let service: DateService;
  let reader: DateReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DateService,
        {
          provide: DateReader,
          useValue: {
            getAvailableDates: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DateService>(DateService);
    reader = module.get<DateReader>(DateReader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all availble dates', async () => {
    const dates = ['2024-01-01', '2024-01-02'];
    const getSpy = jest
      .spyOn(reader, 'getAvailableDates')
      .mockResolvedValue(dates);

    const result = await service.getAvailableDates();

    expect(result).toEqual(dates);
    expect(getSpy).toHaveBeenCalledWith();
  });
});
