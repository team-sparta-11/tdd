import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReservationService } from './reservation.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UserEntity } from 'src/auth/struct/user.entity';
import { RequestReservationDto } from './dto/request-reservation.dto';
import { Reservation } from './reservation.domain';

@Controller('reservation')
@UseGuards(AuthGuard('jwt'))
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post('/')
  requestReservation(
    @Body(ValidationPipe) requestReservationDto: RequestReservationDto,
    @GetUser() user: UserEntity,
  ): Promise<Reservation> {
    return this.reservationService.requestReservation({
      requestReservationDto,
      user,
    });
  }
}
