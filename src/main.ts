import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import swaggerConfig from './config/swagger.config';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  swaggerConfig(app);

  const configService = app.get(ConfigService);
  const appConfig = configService.get('appConfig');
  const proxyConfig = configService.get('proxyConfig');

  app.connectMicroservice<MicroserviceOptions>(proxyConfig['proxyOptions']);
  await app.startAllMicroservices();

  await app.listen(appConfig['port'], '0.0.0.0');

  return appConfig;
}

bootstrap().then((appConfig) => {
  console.log(appConfig['port']);
});
