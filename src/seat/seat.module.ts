import { Module } from '@nestjs/common';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatEntity } from './struct/seat.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/config/jwt.config';
import { SeatReader } from './seat.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([SeatEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [SeatController],
  providers: [SeatService, SeatReader],
})
export class SeatModule {}
