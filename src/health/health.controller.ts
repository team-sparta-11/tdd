import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import Logger from 'src/common/logger/logger';

@Controller('health')
export class HealthController {
  private logger: Logger;
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([]);
  }

  @Get('/db')
  @HealthCheck()
  dbcheck() {
    return this.db.pingCheck('database');
  }
}
