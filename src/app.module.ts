import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOption } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PaymentModule } from './payment/payment.module';
import { SeatModule } from './seat/seat.module';
import { ReservationModule } from './reservation/reservation.module';
import { WaitingModule } from './waiting/waiting.module';
import { ProxyModule } from './common/proxy/proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOption),
    ProxyModule,
    TypeOrmModule.forRootAsync(typeORMConfig),
    AuthModule,
    PaymentModule,
    SeatModule,
    ReservationModule,
    WaitingModule,
  ],
  providers: [AppService],
})
export class AppModule {}
