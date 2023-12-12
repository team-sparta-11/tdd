import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './struct/user.entity';
import { AuthService } from './auth.service';
import { AuthReqSignDto } from './struct/auth.req.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({ summary: '가입' })
  @Post('signup')
  async register(@Body() body: User) {
    return this.service.register(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('signin')
  async sign(@Body() body: AuthReqSignDto) {
    return this.service.sign(body);
  }
}
