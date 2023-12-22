import { Test, TestingModule } from '@nestjs/testing';
import { DateService } from './date.service';
import { DateReader } from './date.handler';

describe('DateService', () => {
  let service: DateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: DateService, useValue: jest.fn() },
        { provide: DateReader, useValue: jest.fn() },
      ],
    }).compile();

    service = module.get<DateService>(DateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
