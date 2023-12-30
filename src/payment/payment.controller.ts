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
import { Payment } from './struct/payment.domain';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RequestReservationDto } from '../reservation/struct/request-reservation.dto';

@ApiTags('payment')
@Controller('payment')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('/balance')
  getBalance(@GetUser() user: UserEntity): number {
    return user.balance;
  }

  @Post('/balance')
  @ApiBody({
    schema: {
      properties: {
        amount: { type: 'number', required: ['true'], default: 200 },
      },
    },
  })
  chargeBalance(
    @GetUser() user: UserEntity,
    @Body('amount', ParseIntPipe) amount: number,
  ): Promise<number> {
    return this.paymentService.chargeBalance({ user, amount });
  }

  @Post('/reservation')
  payReservation(
    @GetUser() user: UserEntity & { statusToken: string },
    @Body() dto: RequestReservationDto,
  ): Promise<Payment> {
    return this.paymentService.payReservation({ user, ...dto });
  }
}
