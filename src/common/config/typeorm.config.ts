import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

const EXTERNAL_DB_ENVS = new Set(['production']);

const ENV_ITG = process.env.NODE_ENV === 'itg';

export const typeOrmConfig = registerAs('typeOrmConfig', () => {
  // jest can't use configService
  if (ENV_ITG) {
    return {
      type: 'postgres',
      host: '127.0.0.1',
      port: global.testPgPort,
      username: 'test',
      password: 'test',
      database: 'test',
      autoLoadEntities: true,
      synchronize: true,
    };
  }

  return {
    type: 'postgres',
    host: process.env['DB_HOST'],
    port: parseInt(process.env['DB_PORT']),
    username: process.env['DB_USERNAME'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_DATABASE'],
    autoLoadEntities: true,
    synchronize: process.env['DB_SYNCHRONIZE'] === 'true',
    ...(EXTERNAL_DB_ENVS.has(process.env.NODE_ENV) && {
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
  };
});

export const typeORMAsyncConfig = {
  useFactory: (): TypeOrmModuleOptions => {
    return typeOrmConfig() as TypeOrmModuleOptions;
  },

  async dataSourceFactory(options: DataSourceOptions) {
    if (!options) {
      throw new Error('Invalid options passed');
    }

    // @TODO: `addTransactionalDataSource` not work with testcontainers, fix it
    if (ENV_ITG) {
      return new DataSource(options);
    }

    return addTransactionalDataSource(new DataSource(options));
  },
};
