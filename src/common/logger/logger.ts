import * as winston from 'winston';
import * as process from 'process';
import * as moment from 'moment-timezone';
import { CloudwatchLoggerAddon } from './logger.addon.cloudwatch';
import { LogLevel, LoggerService } from '@nestjs/common';

const { createLogger, transports } = winston;
const { combine, timestamp, colorize, printf } = winston.format;

export default class Logger implements LoggerService {
  private logger: winston.Logger;
  private cloudwatchAddon: CloudwatchLoggerAddon;
  private is_production = process.env.NODE_ENV === 'production';
  protected now: string;

  constructor(private readonly subject: string) {
    // send to cloudWatch
    this.logger = createLogger({
      level: this.is_production ? 'info' : 'silly',
    });

    // cloudWatch log setup
    if (this.is_production) {
      this.cloudwatchAddon = new CloudwatchLoggerAddon();

      this.logger.add(
        new transports.Console({
          format: combine(
            colorize(),
            timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            printf((info) => {
              return `[${info.timestamp}] [${process.env.NODE_ENV}] [${info.level}] [${this.subject}] : ${info.message}`;
            }),
          ),
        }),
      );
    } else {
      this.logger.add(
        new transports.Console({
          format: combine(
            colorize(),
            timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            printf((info) => {
              return `[${info.timestamp}] [${info.level}] [${this.subject}] : ${info.message}`;
            }),
          ),
        }),
      );
    }
  }

  log(message: any, ..._optionalParams: any[]) {
    this.info(message);
  }
  verbose?(message: any, ..._optionalParams: any[]) {
    this.debug(message);
  }
  fatal?(message: any, ..._optionalParams: any[]) {
    this.error(message);
  }
  setLogLevels?(_levels: LogLevel[]) {
    throw new Error('Method not implemented.');
  }

  public debug(debugMsg: string, metadata = '') {
    this.logger.debug(debugMsg + '-' + metadata);
  }

  public info(msg: string, metadata = '') {
    this.now = moment().format('YYYY-MM-DD HH:mm:ss');
    this.logger.info(msg + ' - ' + metadata);
    if (this.is_production) {
      const info = {
        timestamp: this.now,
        level: 'info',
        category: this.subject,
        message: msg,
        metadata: metadata,
      };
      this.cloudwatchAddon.sendInfo(info);
    }
  }

  public error(errMsg: Error | string, metadata = '') {
    this.now = moment().format('YYYY-MM-DD HH:mm:ss');
    if (errMsg instanceof Error) {
      const err = errMsg.stack ? errMsg.stack : errMsg.message;
      this.logger.error(
        err + '\n======================================\nmetadata: ' + metadata,
      ); // this will now log the error stack trace
    } else {
      this.logger.error(
        errMsg +
          '\n======================================\nmetadata: ' +
          metadata,
      );
    }
    if (this.is_production) {
      const message = {
        timestamp: this.now,
        level: 'error',
        category: this.subject,
        message: errMsg,
        metadata: metadata,
      };
      this.cloudwatchAddon.sendError(message);
    }
  }

  public warn(warnMsg: string, metadata = '') {
    this.now = moment().format('YYYY-MM-DD HH:mm:ss');
    this.logger.warn(warnMsg);
    if (this.is_production) {
      const message = {
        timestamp: this.now,
        level: 'debug',
        category: this.subject,
        message: warnMsg,
        metadata: metadata,
      };
      this.cloudwatchAddon.sendError(message);
    }
  }
}
