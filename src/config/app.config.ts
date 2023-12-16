import { registerAs } from '@nestjs/config';
import { proxyConfig } from './proxy.config';

export const appConfig = registerAs('appConfig', () => ({
  port: process.env['WAITING_PROXY_PORT'] ?? 3000,
}));

export const configModuleOption = {
  isGlobal: true,
  envFilePath: `.env.${process.env['NODE_ENV']}`,
  load: [appConfig, proxyConfig],
};
