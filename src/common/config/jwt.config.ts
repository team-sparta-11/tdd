import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): JwtModuleOptions => {
    return {
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: 60 * 60 * 1000,
      },
    };
  },
};
