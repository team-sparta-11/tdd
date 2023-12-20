import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserReader } from './user.handler';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userReader: UserReader,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: { email: string }, req: Request) {
    const { password: _, ...user } = await this.userReader.findOneByEmail(
      payload.email,
    );

    req.user = user;

    return req.user;
  }
}
