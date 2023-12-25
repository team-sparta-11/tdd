import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

const EXTERNAL_DB_ENVS = new Set(['production']);

export const typeORMConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
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

    return addTransactionalDataSource(new DataSource(options));
  },
};
