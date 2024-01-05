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
  async check() {
    try {
      const result = await this.health.check([]);

      this.logger.info(JSON.stringify(result));

      return result;
    } catch (error) {
      console.error(error);
      this.logger.error(error);
    }
  }

  @Get('/db')
  @HealthCheck()
  dbcheck() {
    this.logger.info('db health checked');
    return this.db.pingCheck('database');
  }
}
