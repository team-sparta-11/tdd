import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerConfig from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  swaggerConfig(app);

  const configService = app.get(ConfigService);
  const appConfig = configService.get('appConfig');

  await app.listen(appConfig['port']);

  return appConfig;
}

bootstrap().then((appConfig) => {
  console.log(appConfig['port']);
});
