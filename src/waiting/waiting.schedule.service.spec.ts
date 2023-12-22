import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest/lib/mocks';
import { RedisClientService } from '../common/redis/redis.client-service';
import { InTaskMock, WaitingNotInTaskMock } from './__mocks__';
import { WaitingScheduleService } from './waiting.schedule.service';
import { ConfigService } from '@nestjs/config/dist/config.service';

describe('WaitingScheduleServiceTest', () => {
  let service: WaitingScheduleService;
  let config: ConfigService;
  let redis: RedisClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, WaitingScheduleService, RedisClientService],
    })
      .useMocker(createMock)
      .compile();

    service = module.get<WaitingScheduleService>(WaitingScheduleService);
    config = module.get<ConfigService>(ConfigService);
    redis = module.get<RedisClientService>(RedisClientService);
  });

  it('moveToTaskTest', async () => {
    jest.spyOn(config, 'get').mockReturnValueOnce({ maxTask: 3 });
    jest.spyOn(redis.task, 'zcount').mockImplementationOnce(async () => 3);
    jest
      .spyOn(redis.task, 'zrange')
      .mockImplementationOnce(async () => [WaitingNotInTaskMock.token]);
    jest
      .spyOn(redis.task, 'zremrangebyrank')
      .mockImplementationOnce(async () => null);
    jest.spyOn(redis.task, 'zadd').mockImplementationOnce(async () => null);

    await service.moveToTask();

    expect(config.get).toHaveBeenCalled();
    expect(redis.task.zcount).toHaveBeenCalled();
    expect(redis.task.zrange).toHaveBeenCalled(); //??
    expect(redis.task.zremrangebyrank).toHaveBeenCalled();
    expect(redis.task.zadd).toHaveBeenCalled();
  });
});
