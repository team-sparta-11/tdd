import { registerAs } from '@nestjs/config';
import { redisConfig } from './redis.config';
import { typeOrmConfig } from './typeorm.config';

export const appConfig = registerAs('appConfig', () => ({
  port: process.env['APP_PORT'] ?? 3000,
  turnOffWaitingGuard: process.env['TURN_OFF_WAITING_GUARD'] === 'true',
  maxTask: process.env['MAX_TASKS'],
  taskExpired: process.env['TASK_EXPIRED_SECONDS'],
}));

export const configModuleOption = {
  isGlobal: true,
  envFilePath: `.env.${process.env['NODE_ENV']}`,
  load: [appConfig, typeOrmConfig, redisConfig],
};
