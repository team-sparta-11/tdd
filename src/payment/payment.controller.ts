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
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get('/balance')
  @UseGuards(AuthGuard())
  getBalance(@GetUser() user: UserEntity): number {
    return user.balance;
  }

  @Post('/balance')
  @UseGuards(AuthGuard())
  chargeBalance(
    @GetUser() user: UserEntity,
    @Body('amount', ParseIntPipe) amount: number,
  ): number {
    return this.paymentService.chargeBalance({ user, amount });
  }
}
