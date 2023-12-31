import { Test, TestingModule } from '@nestjs/testing';
import { PaymentManager } from './payment.handler';
import { PaymentEntity } from './struct/payment.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PAYMENT_STATUS } from 'src/common/types/reservation';
import { createMock } from '@golevelup/ts-jest';

describe('PaymentManager', () => {
  let paymentManager: PaymentManager;
  let paymentRepository: Repository<PaymentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentManager,
        {
          provide: getRepositoryToken(PaymentEntity),
          useClass: Repository,
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    paymentManager = module.get<PaymentManager>(PaymentManager);
    paymentRepository = module.get<Repository<PaymentEntity>>(
      getRepositoryToken(PaymentEntity),
    );
  });

  const mockPayment = {
    userId: 1,
    amount: 10000,
    paymentDate: '2024-01-01',
    status: PAYMENT_STATUS.UNPAID,
  };

  it('should create a payment', async () => {
    const createSpy = jest
      .spyOn(paymentRepository, 'create')
      .mockReturnValue(mockPayment as PaymentEntity);

    const result = paymentManager.create(mockPayment as PaymentEntity);

    expect(createSpy).toHaveBeenCalledWith(mockPayment);
    expect(result).toEqual(mockPayment);
  });

  it('should save a payment', async () => {
    const mockPaymentWithId = {
      ...mockPayment,
      id: 1,
    };

    const saveSpy = jest
      .spyOn(paymentRepository, 'save')
      .mockResolvedValue(mockPaymentWithId as PaymentEntity);

    const result = await paymentManager.save(mockPayment as PaymentEntity);

    expect(saveSpy).toHaveBeenCalledWith(mockPayment);
    expect(result).toEqual(mockPaymentWithId);
  });
});
