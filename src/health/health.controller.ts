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
  ) {
    this.logger = new Logger('Health');
  }

  @Get()
  @HealthCheck()
  check() {
    this.logger.info('health checked');
    return this.health.check([]);
  }

  @Get('/db')
  @HealthCheck()
  dbcheck() {
    this.logger.info('db health checked');
    return this.db.pingCheck('database');
  }
}
