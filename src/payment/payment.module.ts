import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthService } from 'src/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './payment.entity';
import { UserEntity } from 'src/auth/struct/user.entity';
import { ReservationEntity } from 'src/reservation/reservation.entity';
import { ReservationService } from 'src/reservation/reservation.service';
import { SeatEntity } from 'src/seat/seat.entity';
import { UserManager, UserReader } from '../auth/user.handler';
import {
  ReservationManager,
  ReservationReader,
} from 'src/reservation/reservation.handler';
import { PaymentnManager } from './payment.handler';
import { SeatManager, SeatReader } from 'src/seat/seat.handler';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([
      PaymentEntity,
      UserEntity,
      ReservationEntity,
      SeatEntity,
    ]),
  ],
  providers: [
    PaymentService,
    AuthService,
    ReservationService,
    UserReader,
    UserManager,
    ReservationManager,
    ReservationReader,
    PaymentnManager,
    SeatReader,
    SeatManager,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
