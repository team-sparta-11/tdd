import { Module } from '@nestjs/common';
import { TmpApisController } from './tmp-apis.controller';

@Module({
  controllers: [TmpApisController]
})
export class TmpApisModule {}
