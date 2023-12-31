import {
  Module,
  RequestMethod,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOption } from './common/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMAsyncConfig } from './common/config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { SeatModule } from './seat/seat.module';
import { ReservationModule } from './reservation/reservation.module';
import { WaitingModule } from './waiting/waiting.module';
import { RedisClientModule } from './common/redis/redis.client-module';
import { APP_GUARD } from '@nestjs/core';
import { InTaskGuard } from './common/guard/InTask.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { DateModule } from './date/date.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HealthModule } from './health/health.module';
import { HttpLoggerMiddleware } from './middleware/http.logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOption),
    RedisClientModule,
    TypeOrmModule.forRootAsync(typeORMAsyncConfig),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    WaitingModule,
    AuthModule,
    PaymentModule,
    SeatModule,
    ReservationModule,
    WaitingModule,
    DateModule,
    HealthModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: InTaskGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .exclude('/')
      .exclude('/health')
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
