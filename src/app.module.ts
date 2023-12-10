import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { configModuleOption } from './config/app.config';
import { TmpApisModule } from './tmp-apis/tmp-apis.module';

@Module({
  imports: [ConfigModule.forRoot(configModuleOption), TmpApisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
