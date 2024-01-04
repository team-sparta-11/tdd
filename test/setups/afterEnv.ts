import { setupTestPostgres, setupTestRedis } from './integrationSetup';
if (process.env.NODE_ENV === 'itg') {
  beforeAll(async () => {
    const { container: pgContainer, port: pgPort } = await setupTestPostgres();
    const { container: redisContainer, port: redisPort } =
      await setupTestRedis();
    global.testPgContainer = pgContainer;
    global.testRedisContainer = redisContainer;

    global.testPgPort = pgPort;
    global.testRedisHost = redisContainer.getHost();
    global.testRedisPort = redisPort;
  });

  afterAll(async () => {
    global.testPgContainer.stop();
    global.testRedisContainer.stop();
  });
}
