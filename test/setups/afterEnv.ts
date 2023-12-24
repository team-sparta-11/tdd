import {
  setupRedisTestConnection,
  setupTestPostgres,
  setupTestRedis,
  setupTypeOrmTestConnection,
} from './integrationSetup';

if (process.env.TEST_TYPE === 'itg') {
  beforeAll(async () => {
    const { container: pgContainer, port: pgPort } = await setupTestPostgres();
    const { container: redisContainer, port: redisPort } =
      await setupTestRedis();
    global.testPgContainer = pgContainer;
    global.testRedisContainer = redisContainer;

    global.testTypeOrmConn = await setupTypeOrmTestConnection(pgPort);
    global.testRedisConn = await setupRedisTestConnection(redisPort);
  });
}
