import { registerAs } from '@nestjs/config';

console.log(process.env);

export const appConfig = registerAs('appConfig', () => ({
  port: process.env['APP_PORT'],
}));

export const configModuleOption = {
  isGlobal: true,
  envFilePath: `.env.${process.env['APP_PORT']}`,
  load: [appConfig],
};
