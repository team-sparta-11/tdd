import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';

import { PRICE, PaymentService } from './payment.service';

import { UserManager } from 'src/auth/user.handler';
import {
  ReservationManager,
  ReservationReader,
} from 'src/reservation/reservation.handler';
import { PaymentnManager } from './payment.handler';

import { User } from 'src/auth/struct/user.domain';
import { Reservation } from 'src/reservation/reservation.domain';

import { PAYMENT_STATUS } from 'src/common/types/reservation';

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

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  runOnTransactionCommit: () => () => ({}),
  runOnTransactionRollback: () => () => ({}),
  runOnTransactionComplete: () => () => ({}),
  initializeTransactionalContext: () => ({}),
}));

describe('PaymentService', () => {
  let service: PaymentService;
  let userManager: UserManager;
  let reservationManager: ReservationManager;
  let reservationReader: ReservationReader;
  let paymentManager: PaymentnManager;

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
          provide: PaymentnManager,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    userManager = module.get<UserManager>(UserManager);
    reservationManager = module.get<ReservationManager>(ReservationManager);
    reservationReader = module.get<ReservationReader>(ReservationReader);
    paymentManager = module.get<PaymentnManager>(PaymentnManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('chargeBalance', () => {
    it('should charge user balance', async () => {
      const amount = 500;

      const newUser = { ...mockUser, balance: mockUser.balance + amount };
      jest.spyOn(userManager, 'save').mockResolvedValue(newUser);

      const newBalance = await service.chargeBalance({
        user: mockUser,
        amount,
      });
      expect(newBalance).toEqual(mockUser.balance + amount);
    });
  });

  describe('payReservation', () => {
    it('should throw error if balance is not enough', async () => {
      const user = { ...mockUser, balance: 0 };

      jest
        .spyOn(reservationReader, 'findOne')
        .mockResolvedValue(mockReservation);

      await expect(
        service.payReservation({ user, reservationId: mockReservation.id }),
      ).rejects.toThrow(
        new InternalServerErrorException('Balance is not enough to pay'),
      );
    });

    it('should throw error if reservation is not found', async () => {
      const reservationId = 0;

      jest.spyOn(reservationReader, 'findOne').mockResolvedValue(null);

      await expect(
        service.payReservation({ user: mockUser, reservationId }),
      ).rejects.toThrow(
        new InternalServerErrorException('Reservation is not on list'),
      );
    });

    it('should throw error if reservation is expired', async () => {
      const user = { ...mockUser, balance: PRICE };

      const reservation = { ...mockReservation, isExpired: true };

      jest.spyOn(reservationReader, 'findOne').mockResolvedValue(reservation);

      await expect(
        service.payReservation({ user, reservationId: reservation.id }),
      ).rejects.toThrow(
        new InternalServerErrorException('Reservation is expired'),
      );
    });

    it('should pay reservation', async () => {
      jest
        .spyOn(reservationReader, 'findOne')
        .mockResolvedValue(mockReservation);

      const paidReservation = {
        ...mockReservation,
        paymentStatus: PAYMENT_STATUS.PAID,
      };
      jest.spyOn(reservationManager, 'save').mockResolvedValue(paidReservation);
      jest
        .spyOn(userManager, 'save')
        .mockResolvedValue({ ...mockUser, balance: mockUser.balance - PRICE });

      const payment = {
        id: 1,
        userId: mockUser.id,
        amount: PRICE,
        paymentDate: new Date().toISOString(),
        status: PAYMENT_STATUS.PAID,
        reservationId: paidReservation.id,
      };

      jest.spyOn(paymentManager, 'create').mockReturnValue(payment);
      jest.spyOn(paymentManager, 'save').mockResolvedValue(payment);

      const result = await service.payReservation({
        user: mockUser,
        reservationId: mockReservation.id,
      });
      expect(result).toEqual(payment);
    });
  });
});
