import 'reflect-metadata';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Redis } from 'ioredis';

const PG_PORT = 5432;
const PG_DB_NAME = 'test';
const PG_USER_NAME = 'test';
const PG_PASSWORD = 'test';
const PG_IMAGE = 'postgres:16.1';

export interface TestContainerData {
  container: StartedTestContainer;
  port: number;
}

export const setupTestPostgres = async (): Promise<TestContainerData> => {
  const container = await new PostgreSqlContainer(PG_IMAGE)
    .withExposedPorts(PG_PORT)
    .withEnvironment({
      POSTGRES_DB: PG_DB_NAME,
      POSTGRES_USER: PG_USER_NAME,
      POSTGRES_PASSWORD: PG_PASSWORD,
    })
    .start();

  const port = container.getMappedPort(PG_PORT);

  return {
    container,
    port,
  };
};

const REDIS_PORT = 6379;
const REDIS_IMAGE = 'redis:7.2';

export const setupTestRedis = async (): Promise<TestContainerData> => {
  const container = await new GenericContainer(REDIS_IMAGE)
    .withExposedPorts(REDIS_PORT)
    .start();

  const port = container.getMappedPort(REDIS_PORT);

  return {
    container,
    port,
  };
};

export const setupTypeOrmTestConnection = async (port: number = PG_PORT) => {
  const opts = getTestDatabaseConnectionOptions(port);

  const dataSource = new DataSource(opts);
  // await dataSource.runMigrations();
  return dataSource.initialize();
};

const getTestDatabaseConnectionOptions = (
  dbPort: number,
): DataSourceOptions => ({
  type: 'postgres',
  host: 'localhost',
  port: dbPort,
  database: PG_DB_NAME,
  username: PG_USER_NAME,
  password: PG_PASSWORD,
});

export const setupRedisTestConnection = async (port: number = REDIS_PORT) => {
  const redisClient = new Redis({
    host: 'localhost',
    port,
  });

  return redisClient;
};
