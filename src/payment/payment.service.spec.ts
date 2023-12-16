import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { AuthService } from 'src/auth/auth.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PaymentService, useValue: jest.fn() },
        { provide: AuthService, useValue: jest.fn() },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
