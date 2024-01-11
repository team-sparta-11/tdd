import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerConfig from './common/config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionFilter } from './common/filter/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  swaggerConfig(app);

  const configService = app.get(ConfigService);
  const appConfig = configService.get('appConfig');

  app.useGlobalFilters(new ExceptionFilter());

  await app.listen(appConfig['port']);

  return appConfig;
}

bootstrap().then((appConfig) => {
  console.log(appConfig['port']);
});
