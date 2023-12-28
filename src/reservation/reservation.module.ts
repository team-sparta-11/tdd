import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from 'src/common/config/jwt.config';
import { ReservationEntity } from './struct/reservation.entity';
import { SeatEntity } from 'src/seat/struct/seat.entity';
import { SeatService } from 'src/seat/seat.service';
import { DateEntity } from 'src/date/struct/date.entity';
import { ReservationManager, ReservationReader } from './reservation.handler';
import { SeatManager, SeatReader } from 'src/seat/seat.handler';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([ReservationEntity, SeatEntity, DateEntity]),
  ],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    SeatService,
    ReservationManager,
    ReservationReader,
    SeatReader,
    SeatManager,
  ],
})
export class ReservationModule {}
