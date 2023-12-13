import { registerAs } from '@nestjs/config';
import {
  RedisModuleAsyncOptions,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';

const config = () => ({
  host: process.env['REDIS_HOST'] ?? '127.0.0.1',
  port: Number(process.env['REDIS_PORT']) ?? 6379,
});

export const redisConfig = registerAs('redis', config);

export const redisAsyncOption = (): RedisModuleAsyncOptions => {
  return {
    useFactory: (): RedisModuleOptions | Promise<RedisModuleOptions> => ({
      config: config(),
    }),
  };
};

export const bullOption = () => ({
  redis: config(),
});
