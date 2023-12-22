import { Module } from '@nestjs/common';
import { DateController } from './date.controller';
import { DateService } from './date.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateEntity } from './date.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/config/jwt.config';
import { DateReader } from './date.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([DateEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [DateController],
  providers: [DateService, DateReader],
})
export class DateModule {}
