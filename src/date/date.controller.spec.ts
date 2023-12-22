import { Test, TestingModule } from '@nestjs/testing';
import { DateController } from './date.controller';
import { DateService } from './date.service';
import { DateReader } from './date.handler';

describe('DateController', () => {
  let controller: DateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DateController],
      providers: [
        { provide: DateService, useValue: jest.fn() },
        { provide: DateReader, useValue: jest.fn() },
      ],
    }).compile();

    controller = module.get<DateController>(DateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
