import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { ReservationService } from './reservation.service';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { RequestReservationDto } from './struct/request-reservation.dto';
import { SeatManager, SeatReader } from 'src/seat/seat.handler';
import { Seat } from 'src/seat/struct/seat.domain';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('ReservationService', () => {
  let reservationService: ReservationService;
  let seatReader: SeatReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: ReservationManager,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ReservationReader,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: SeatManager,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: SeatReader,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(),
          },
        },
      ],
    }).compile();

    reservationService = module.get<ReservationService>(ReservationService);
    seatReader = module.get<SeatReader>(SeatReader);
  });

  it('should be defined', () => {
    expect(reservationService).toBeDefined();
  });

  it('should throw InternalServerErrorException if seat is not available', async () => {
    const requestReservationDto: RequestReservationDto = {
      seatNumber: 1,
      date: '2024-01-01',
    };

    const seat: Seat = {
      id: 1,
      userId: 1,
      seatNumber: 1,
      date: '2024-01-01',
    };

    const getSeatSpy = jest
      .spyOn(seatReader, 'findOne')
      .mockResolvedValue(seat);

    await expect(
      reservationService.requestReservation({
        requestReservationDto,
        userId: 1,
      }),
    ).rejects.toThrow(
      new InternalServerErrorException('Seat is already reserved'),
    );

    expect(getSeatSpy).toHaveBeenCalledWith({
      seatNumber: requestReservationDto.seatNumber,
      dateAvailability: { date: requestReservationDto.date },
    });
  });
});
