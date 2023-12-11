import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// @ApiTags('user/auth')
@Controller('')
export class TmpApisController {
  @ApiTags('user/auth')
  @ApiOperation({ summary: '가입' })
  @Post('auth/signup')
  async register() {}

  @ApiTags('user/auth')
  @ApiOperation({ summary: '로긴/토큰발급' })
  @Post('auth/signin')
  async sign() {}

  @ApiTags('date')
  @ApiOperation({ summary: '가능 날짜', description: '공석이 1 이상' })
  @Get('date/open')
  async openDates() {}

  @ApiTags('seat')
  @ApiOperation({
    summary: '가능 좌석',
    description: '예약, 결제 상태가 아닌 무상태의 좌석 목록 By 날짜',
  })
  @Get('seat/open/:date')
  async openSeats(@Param('date') _date: string) {}

  @ApiTags('seat')
  @ApiOperation({
    summary: '좌석 예약',
    description: '예약하기. {날짜, 좌석[], }',
  })
  @Post('seat/')
  async reserveSeats(@Body() body: unknown) {}

  @ApiTags('seat')
  @ApiOperation({
    summary: '예약/결제 확인',
    description:
      'empty || OO월OO일 [RR석1, RR석2] 예약됨 || 결제됨 || 취소됨 || 환불완료',
  })
  @Get('seat/my')
  async my() {}

  @ApiTags('pay')
  @ApiOperation({
    summary: '결제',
    description: '예약좌석 결제하기',
  })
  @Post('pay/')
  async payForReserve(@Body() body: unknown) {}

  @ApiTags('point')
  @ApiOperation({
    summary: '포인트 충전하기',
    description: '{결제액: number}',
  })
  @Post('point/')
  async charge(@Body() body: unknown) {}

  @ApiTags('point')
  @ApiOperation({
    summary: '포인트 확인하기',
    description: '',
  })
  @Get('point/')
  async myPoint() {}
}
