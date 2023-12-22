import { Test, TestingModule } from '@nestjs/testing';
import { WaitingManager, WaitingReader } from './waiting.handler';
import { createMock } from '@golevelup/ts-jest/lib/mocks';
import { RedisClientService } from '../common/redis/redis.client-service';
import { InTaskMock, WaitingNotInTaskMock } from './__mocks__';

describe('WaitingHandle', () => {
  let manager: WaitingManager;
  let reader: WaitingReader;
  let redis: RedisClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WaitingManager, WaitingReader, RedisClientService],
    })
      .useMocker(createMock)
      .compile();

    manager = module.get<WaitingManager>(WaitingManager);
    reader = module.get<WaitingReader>(WaitingReader);
    redis = module.get<RedisClientService>(RedisClientService);
  });

  it('manager lpush test', async () => {
    jest.spyOn(redis.waiting, 'zadd').mockImplementationOnce(async () => null);
    jest.spyOn(redis.waiting, 'zrank').mockImplementationOnce(async () => 0);

    const result = await manager.lpush(WaitingNotInTaskMock.token);

    expect(redis.waiting.zadd).toHaveBeenCalled();
    expect(redis.waiting.zrank).toHaveBeenCalled();
    expect(result).toEqual(WaitingNotInTaskMock);
  });

  it('reader isInTask test', async () => {
    jest
      .spyOn(redis.task, 'zscore')
      .mockImplementationOnce(async () => WaitingNotInTaskMock.token);

    const result = await reader.isInTask(InTaskMock.token);

    expect(redis.task.zscore).toHaveBeenCalled();
    expect(result).toEqual(InTaskMock);
  });

  it('reader isInWaiting test', async () => {
    jest.spyOn(redis.waiting, 'zrank').mockImplementationOnce(async () => 0);

    const result = await reader.isInWaiting(WaitingNotInTaskMock.token);

    expect(redis.waiting.zrank).toHaveBeenCalled();
    expect(result).toEqual(WaitingNotInTaskMock);
  });
});
