import { registerAs } from '@nestjs/config';
import { redisConfig } from './redis.config';

export const appConfig = registerAs('appConfig', () => ({
  port: process.env['APP_PORT'] ?? 3000,
  maxTask: process.env['MAX_TASKS'],
  taskExpired: process.env['TASK_EXPIRED_SECONDS'],
}));

export const configModuleOption = {
  isGlobal: true,
  envFilePath: `.env.${process.env['NODE_ENV']}`,
  load: [appConfig, redisConfig],
};
