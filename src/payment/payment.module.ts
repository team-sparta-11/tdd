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
import { SeatEntity } from 'src/seat/struct/seat.entity';
import { UserManager, UserReader } from '../auth/user.handler';
import {
  ReservationManager,
  ReservationReader,
} from 'src/reservation/reservation.handler';
import { PaymentManager } from './payment.handler';
import { SeatManager, SeatReader } from 'src/seat/seat.handler';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
    EventEmitter2,
    PaymentService,
    AuthService,
    ReservationService,
    UserReader,
    UserManager,
    ReservationManager,
    ReservationReader,
    PaymentManager,
    SeatReader,
    SeatManager,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
