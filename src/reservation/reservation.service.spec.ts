import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { SeatService } from 'src/seat/seat.service';

describe('ReservationService', () => {
  let service: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ReservationService, useValue: jest.fn() },
        { provide: SeatService, useValue: jest.fn() },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
