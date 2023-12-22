import { Test, TestingModule } from '@nestjs/testing';
import { WaitingUtil } from './waiting.util';
import { v4 as uuid } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'someUUID'),
}));

describe('WaitingUtil', () => {
  let util: WaitingUtil;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitingUtil],
    }).compile();

    util = module.get<WaitingUtil>(WaitingUtil);
  });

  it('generate token', async () => {
    await util.generateStatusToken();

    expect(uuid).toHaveBeenCalled();
  });
});
