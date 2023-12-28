import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest/lib/mocks';
import { WaitingNotInTaskMock } from './__mocks__';
import { WaitingScheduleService } from './waiting.schedule.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { WaitingManager, WaitingReader } from './waiting.handler';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';

describe('WaitingScheduleServiceTest', () => {
  let service: WaitingScheduleService;
  let config: ConfigService;
  let waitingManager: WaitingManager;
  let waitingReader: WaitingReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        WaitingScheduleService,
        WaitingManager,
        WaitingReader,
      ],
    } as ModuleMetadata)
      .useMocker(createMock)
      .compile();

    service = module.get<WaitingScheduleService>(WaitingScheduleService);
    config = module.get<ConfigService>(ConfigService);
    waitingManager = module.get<WaitingManager>(WaitingManager);
    waitingReader = module.get<WaitingReader>(WaitingReader);
  });

  it('moveToTaskTest', async () => {
    jest.spyOn(config, 'get').mockReturnValueOnce({ maxTask: 3 });
    jest
      .spyOn(waitingReader, 'getOpenTaskCnt')
      .mockImplementationOnce(async () => 3);
    jest
      .spyOn(waitingManager, 'deQueueFromWaiting')
      .mockImplementationOnce(async () => [WaitingNotInTaskMock.token]);
    jest
      .spyOn(waitingManager, 'enQueueToTask')
      .mockImplementationOnce(async () => null);

    await service.moveToTask();

    expect(config.get).toHaveBeenCalled();
    expect(waitingReader.getOpenTaskCnt).toHaveBeenCalled();
    expect(waitingManager.deQueueFromWaiting).toHaveBeenCalled();
    expect(waitingManager.enQueueToTask).toHaveBeenCalled();
  });
});
