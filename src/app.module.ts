import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOption } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './domain/auth/auth.module';
import { WaitingModule } from './domain/waiting/waiting.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { bullOption, redisAsyncOption } from './config/redis.config';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOption),
    TypeOrmModule.forRootAsync(typeORMConfig),
    RedisModule.forRootAsync(redisAsyncOption()),
    BullModule.forRoot(bullOption()),
    AuthModule,
    WaitingModule,
  ],
  providers: [AppService],
})
export class AppModule {}
