import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOption } from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOption),
    TypeOrmModule.forRootAsync(typeORMConfig),
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
