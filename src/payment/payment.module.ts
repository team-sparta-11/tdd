import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { AuthService } from 'src/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './payment.entity';
import { UserEntity } from 'src/auth/user.entity';
import { ReservationEntity } from 'src/reservation/reservation.entity';
import { ReservationService } from 'src/reservation/reservation.service';
import { SeatEntity } from 'src/seat/seat.entity';

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
  providers: [PaymentService, AuthService, ReservationService],
  controllers: [PaymentController],
})
export class PaymentModule {}
