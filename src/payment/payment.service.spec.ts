import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { PRICE, PaymentService } from './payment.service';

import { UserManager } from 'src/auth/user.handler';
import {
  ReservationManager,
  ReservationReader,
} from 'src/reservation/reservation.handler';
import { PaymentManager } from './payment.handler';

import { User } from 'src/auth/struct/user.domain';
import { Reservation } from 'src/reservation/reservation.domain';

import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from 'src/auth/struct/user.entity';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'mockedHash',
  balance: 100000,
};

const mockReservation: Reservation = {
  id: 1,
  userId: mockUser.id,
  date: '2023-03-01',
  seatNumber: 1,
  isExpired: false,
  paymentStatus: PAYMENT_STATUS.UNPAID,
};

describe('PaymentService', () => {
  let service: PaymentService;
  let userManager: UserManager;
  let reservationManager: ReservationManager;
  let reservationReader: ReservationReader;
  let paymentManager: PaymentManager;

  beforeEach(async () => {
    initializeTransactionalContext();
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
        EventEmitter2,
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    userManager = module.get<UserManager>(UserManager);
    reservationManager = module.get<ReservationManager>(ReservationManager);
    reservationReader = module.get<ReservationReader>(ReservationReader);
    paymentManager = module.get<PaymentManager>(PaymentManager);
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
        service.payReservation({ user, reservationId: mockReservation.id }),
      ).rejects.toThrow(
        new InternalServerErrorException('Balance is not enough to pay'),
      );
    });

    it('should throw error if reservation is not found', async () => {
      const reservationId = 0;

      const findSpy = jest
        .spyOn(reservationReader, 'findOne')
        .mockResolvedValue(null);

      await expect(
        service.payReservation({ user: mockUser, reservationId }),
      ).rejects.toThrow(
        new InternalServerErrorException('Reservation is not on list'),
      );

      expect(findSpy).toHaveBeenCalledWith({ id: reservationId });
    });

    it('should throw error if reservation is expired', async () => {
      const user = { ...mockUser, balance: PRICE };

      const reservation = { ...mockReservation, isExpired: true };

      const findSpy = jest
        .spyOn(reservationReader, 'findOne')
        .mockResolvedValue(reservation);

      await expect(
        service.payReservation({ user, reservationId: reservation.id }),
      ).rejects.toThrow(
        new InternalServerErrorException('Reservation is expired'),
      );

      expect(findSpy).toHaveBeenCalledWith({ id: reservation.id });
    });

    it('should pay reservation', async () => {
      // TODO: apply new pay reservation logic
    });
  });
});
