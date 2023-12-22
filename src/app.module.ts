import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOption } from './common/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './common/config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { SeatModule } from './seat/seat.module';
import { ReservationModule } from './reservation/reservation.module';
import { WaitingModule } from './waiting/waiting.module';
import { RedisClientModule } from './common/redis/redis.client-module';
import { APP_GUARD } from '@nestjs/core';
import { InTaskGuard } from './common/guard/InTask.guard';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOption),
    RedisClientModule,
    TypeOrmModule.forRootAsync(typeORMConfig),
    ScheduleModule.forRoot(),
    WaitingModule,
    AuthModule,
    PaymentModule,
    SeatModule,
    ReservationModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: InTaskGuard,
    },
  ],
})
export class AppModule {}
