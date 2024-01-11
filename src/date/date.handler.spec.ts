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

    const queries: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValueOnce(mockDates),
    };

    const findSpy = jest
      .spyOn(dateRepository, 'createQueryBuilder')
      .mockReturnValueOnce(queries);

    const result = await dateReader.getAvailableDates();

    const expectedDates = mockDates.map((date) => date.date);
    expect(result).toEqual(expectedDates as string[]);

    expect(findSpy).toHaveBeenCalledWith('date');
    expect(queries.leftJoinAndSelect).toHaveBeenCalledWith(
      'date.seatAvailability',
      'seatAvailability',
    );
    expect(queries.where).toHaveBeenCalledWith(
      'seatAvailability.userId IS NULL',
    );
    expect(queries.orderBy).toHaveBeenCalledWith('date.date', 'ASC');
    expect(queries.getMany).toHaveBeenCalled();
  });
});
