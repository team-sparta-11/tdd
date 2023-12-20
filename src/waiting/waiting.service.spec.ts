import { Test, TestingModule } from '@nestjs/testing';
import { WaitingService } from './waiting.service';
import { createMock } from '@golevelup/ts-jest';
import { WaitingUtil } from './waiting.util';
import { WaitingManager, WaitingReader } from './waiting.handler';
import { WaitingNotInTaskMock } from './__mocks__';

describe('WaitingService', () => {
  let service: WaitingService;
  let util: WaitingUtil;
  let manager: WaitingManager;
  let reader: WaitingReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitingService, WaitingUtil, WaitingManager, WaitingReader],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<WaitingService>(WaitingService);
    util = module.get<WaitingUtil>(WaitingUtil);
    manager = module.get<WaitingManager>(WaitingManager);
    reader = module.get<WaitingReader>(WaitingReader);
  });

  it('when not in waiting, task both, call manager, reader both', async () => {
    jest
      .spyOn(util, 'generateStatusToken')
      .mockImplementationOnce(async () => WaitingNotInTaskMock.token);
    jest
      .spyOn(reader, 'isInTask')
      .mockImplementation(async () => WaitingNotInTaskMock);
    jest.spyOn(reader, 'isInWaiting').mockResolvedValue(false);
    jest
      .spyOn(manager, 'lpush')
      .mockImplementationOnce(async () => WaitingNotInTaskMock);

    const result = await service.work();

    expect(result).toEqual(WaitingNotInTaskMock);

    expect(util.generateStatusToken).toHaveBeenCalled();
    expect(reader.isInTask).toHaveBeenCalled();
    expect(reader.isInWaiting).toHaveBeenCalled();
    expect(manager.lpush).toHaveBeenCalled();
  });
});
