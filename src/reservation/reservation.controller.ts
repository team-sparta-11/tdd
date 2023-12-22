import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReservationService } from './reservation.service';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { RequestReservationDto } from './dto/request-reservation.dto';
import { Reservation } from './reservation.domain';
import { User } from 'src/auth/struct/user.domain';

@Controller('reservation')
@UseGuards(AuthGuard('jwt'))
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post('/')
  requestReservation(
    @Body() requestReservationDto: RequestReservationDto,
    @GetUser() user: User,
  ): Promise<Reservation> {
    return this.reservationService.requestReservation({
      requestReservationDto,
      userId: user.id,
    });
  }
}
