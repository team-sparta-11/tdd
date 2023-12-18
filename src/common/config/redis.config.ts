import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redisConfig', () => ({
  config: [
    {
      namespace: 'waiting',
      host: '127.0.0.1',
      port: process.env['REDIS_PORT'],
      // password: 'redisPw'
    },
    {
      namespace: 'task',
      host: '127.0.0.1',
      port: process.env['REDIS_PORT'],
      // password: 'redisPw'
    },
  ],
}));
