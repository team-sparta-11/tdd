import { registerAs } from '@nestjs/config';

export const redisConfig = registerAs('redisConfig', () => {
  const ENV_ITG = process.env.NODE_ENV === 'itg';

  return ENV_ITG
    ? {
        config: [
          {
            namespace: 'waiting',
            host: global.testRedisHost,
            port: global.testRedisPort,
            // password: 'redisPw'
          },
          {
            namespace: 'task',
            host: global.testRedisHost,
            port: global.testRedisPort,
            // password: 'redisPw'
          },
          {
            namespace: 'reservation',
            host: global.testRedisHost,
            port: global.testRedisPort,
            // password: 'redisPw'
          },
        ],
      }
    : {
        config: [
          {
            namespace: 'waiting',
            host: process.env['REDIS_HOST'],
            port: process.env['REDIS_PORT'],
            // password: 'redisPw'
          },
          {
            namespace: 'task',
            host: process.env['REDIS_HOST'],
            port: process.env['REDIS_PORT'],
            // password: 'redisPw'
          },
          {
            namespace: 'reservation',
            host: process.env['REDIS_HOST'],
            port: process.env['REDIS_PORT'],
            // password: 'redisPw'
          },
        ],
      };
});
