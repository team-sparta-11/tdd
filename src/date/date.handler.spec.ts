import { Test, TestingModule } from '@nestjs/testing';
import { DateReader } from './date.handler';
import { DateEntity } from './struct/date.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DateReader', () => {
  let dateReader: DateReader;
  let dateRepository: Repository<DateEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DateReader,
        {
          provide: getRepositoryToken(DateEntity), // Replace getRepositoryToken with your actual function to get repository token
          useClass: Repository,
        },
      ],
    }).compile();

    dateReader = module.get<DateReader>(DateReader);
    dateRepository = module.get<Repository<DateEntity>>(
      getRepositoryToken(DateEntity),
    );
  });

  it('should return available dates', async () => {
    const mockDates: Partial<DateEntity>[] = [{ date: '2024-01-01' }];

    const findSpy = jest
      .spyOn(dateRepository, 'find')
      .mockResolvedValue(mockDates as DateEntity[]);

    const result = await dateReader.getAvailableDates();

    expect(findSpy).toHaveBeenCalledWith({
      relations: ['seatAvailability'],
      where: {
        seatAvailability: {
          userId: null,
        },
      },
      order: {
        date: 'ASC',
      },
    });

    const expectedDates = mockDates.map((date) => date.date);
    expect(result).toEqual(expectedDates as string[]);
  });
});
