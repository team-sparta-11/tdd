import { Global, Module } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientService } from './redis.client-service';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return configService.get('redisConfig');
      },
    }),
  ],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
