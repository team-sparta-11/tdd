import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new ConflictException('email already exist');
    }

    await this.userService.create({ email, password });
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.userId, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async verifyAccessToken(accessToken: string) {
    try {
      const accessTokenValue = accessToken.split(' ')[1];
      await this.jwtService.verify(accessTokenValue);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('access token not valid');
    }

    return true;
  }
}
