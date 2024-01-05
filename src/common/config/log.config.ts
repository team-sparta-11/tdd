import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import SentryTransport from 'winston-transport-sentry-node';
import { ConsoleTransportInstance } from 'winston/lib/winston/transports';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as SlackHook from 'winston-slack-webhook-transport';

const dailyOption = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: `./logs/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike(process.env.NODE_ENV, {
        colors: false,
        prettyPrint: true,
      }),
    ),
  };
};

export const winstonOption: {
  transports: (
    | ConsoleTransportInstance
    | DailyRotateFile
    | SentryTransport
    | SlackHook
  )[];
} = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV !== 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(process.env.NODE_ENV, {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ],
};

if (process.env.NODE_ENV !== 'production') {
  winstonOption.transports.push(new winstonDaily(dailyOption('info')));
  winstonOption.transports.push(
    new SentryTransport({
      level: 'info',
      sentry: {
        dsn: process.env['SENTRY_DSN'],
      },
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(process.env.NODE_ENV),
      ),
    }),
  );
  winstonOption.transports.push(
    new SlackHook({
      level: 'info',
      webhookUrl: process.env['SLACK_HOOK'],
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(process.env.NODE_ENV),
      ),
    }),
  );
}

export const winstonLogger = WinstonModule.createLogger(winstonOption);
