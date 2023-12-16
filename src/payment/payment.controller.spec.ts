import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { AuthService } from 'src/auth/auth.service';
import { PaymentService } from './payment.service';

describe('PaymentController', () => {
  let controller: PaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: AuthService, useValue: jest.fn() },
        { provide: PaymentService, useValue: jest.fn() },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
