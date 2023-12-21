import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UserEntity } from 'src/auth/struct/user.entity';

@Controller('payment')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('/balance')
  getBalance(@GetUser() user: UserEntity): number {
    return user.balance;
  }

  @Post('/balance')
  chargeBalance(
    @GetUser() user: UserEntity,
    @Body('amount', ParseIntPipe) amount: number,
  ): Promise<number> {
    return this.paymentService.chargeBalance({ user, amount });
  }

  @Post('/reservation')
  payReservation(
    @GetUser() user: UserEntity,
    @Body('reservationId', ParseIntPipe) reservationId: number,
  ) {
    return this.paymentService.payReservation({ user, reservationId });
  }
}
