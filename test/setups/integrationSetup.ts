import 'reflect-metadata';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { GenericContainer, StartedTestContainer } from 'testcontainers';

const PG_PORT = 5432;
const PG_DB_NAME = 'postgres';
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
    .withReuse()
    .withNetworkMode('bridge')
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
    .withReuse()
    .withNetworkMode('bridge')
    .start();

  const port = container.getMappedPort(REDIS_PORT);

  return {
    container,
    port,
  };
};
