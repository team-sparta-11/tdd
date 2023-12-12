import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const JWT = {
  secret: process.env['JWT_SEC'] || 'secret',
  expiresIn: '3d',
  expiresRefreshIn: '30d',
};

export default registerAs('jwt', () => JWT);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt['fromAuthHeaderAsBearerToken'](),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  // request.user
  async validate(payload: JwtPayload) {
    return payload;
  }
}

export const jwtOption = (): JwtModuleAsyncOptions => {
  return {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
        global: true,
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      };
    },
  };
};

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
  // tokenType: refresh | access
}
