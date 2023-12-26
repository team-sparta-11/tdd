import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

const EXTERNAL_DB_ENVS = new Set(['production']);

const ENV_ITG = process.env.NODE_ENV === 'itg';

export const typeORMConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
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
      host: configService.get<string>('DB_HOST'),
      port: parseInt(configService.get<string>('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      autoLoadEntities: true,
      synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
      ...(EXTERNAL_DB_ENVS.has(process.env.NODE_ENV) && {
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    };
  },

  async dataSourceFactory(options) {
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
