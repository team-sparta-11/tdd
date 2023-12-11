import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('appConfig', () => ({
  port: process.env['APP_PORT'] ?? 3000,
}));

export const configModuleOption = {
  isGlobal: true,
  envFilePath: `.env.${process.env['NODE_ENV']}`,
  load: [appConfig],
};
