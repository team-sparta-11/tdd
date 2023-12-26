import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmConfig } from './typeorm.config';
import { config } from 'dotenv';

config({ path: '.env.development' });

const options = typeOrmConfig();
options['entities'] = ['src/**/struct/*.entity.ts'];
options['seeds'] = ['src/seeds/**/*.ts'];
options.synchronize = false;

export default new DataSource(options as DataSourceOptions);
