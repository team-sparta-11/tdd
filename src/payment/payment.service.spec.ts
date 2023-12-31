import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { PRICE, PaymentService } from './payment.service';

import { UserManager } from 'src/auth/user.handler';
import {
  ReservationManager,
  ReservationReader,
} from 'src/reservation/reservation.handler';
import { PaymentManager } from './payment.handler';

import { User } from 'src/auth/struct/user.domain';
import { Reservation } from 'src/reservation/struct/reservation.domain';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from 'src/auth/struct/user.entity';
import { createMock } from '@golevelup/ts-jest';
import { SeatManager } from '../seat/seat.handler';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'mockedHash',
  balance: 100000,
};

const mockReservation: Reservation = {
  userId: mockUser.id,
  date: '2023-03-01',
  seatNumber: 1,
};

describe('PaymentService', () => {
  let service: PaymentService;
  let userManager: UserManager;
  let reservationReader: ReservationReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: UserManager,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: ReservationManager,
          useValue: {
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
          provide: PaymentManager,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: SeatManager,
          useValue: {
            update: jest.fn(),
          },
        },
        EventEmitter2,
      ],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<PaymentService>(PaymentService);
    userManager = module.get<UserManager>(UserManager);
    reservationReader = module.get<ReservationReader>(ReservationReader);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chargeBalance', () => {
    it('should charge user balance', async () => {
      const amount = 500;

      const newUser = { ...mockUser, balance: mockUser.balance + amount };
      const saveSpy = jest
        .spyOn(userManager, 'save')
        .mockResolvedValue(newUser as UserEntity);

      const newBalance = await service.chargeBalance({
        user: mockUser,
        amount,
      });

      expect(saveSpy).toHaveBeenCalledWith(newUser);
      expect(newBalance).toEqual(mockUser.balance + amount);
    });
  });

  describe('payReservation', () => {
    it('should throw error if balance is not enough', async () => {
      const user = { ...mockUser, balance: 0 };

      await expect(
        service.payReservation({
          user,
          seatNumber: mockReservation.seatNumber,
          date: mockReservation.date,
        }),
      ).rejects.toThrow(
        new InternalServerErrorException('Balance is not enough to pay'),
      );
    });

    it('should throw error if reservation is expired or not reserved', async () => {
      const user = { ...mockUser, balance: PRICE };

      const findSpy = jest
        .spyOn(reservationReader, 'findOne')
        .mockResolvedValue(null);

      await expect(
        service.payReservation({
          user,
          seatNumber: mockReservation.seatNumber,
          date: mockReservation.date,
        }),
      ).rejects.toThrow(
        new NotFoundException('Reservation is not on list or expired'),
      );

      expect(findSpy).toHaveBeenCalledWith({
        seatNumber: mockReservation.seatNumber,
        date: mockReservation.date,
      });
    });

    it('should pay reservation', async () => {
      // TODO: apply new pay reservation logic
    });
  });
});
