import { Test, TestingModule } from '@nestjs/testing';
import { SeatService } from './seat.service';

describe('SeatService', () => {
  let service: SeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: SeatService, useValue: jest.fn() }],
    }).compile();

    service = module.get<SeatService>(SeatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
