import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    'main.ts',
    'module.ts',
    'controller.ts',
    'provider.ts',
    'repository.ts',
    'dto.ts',
    'enum.ts',
    'struct.ts',
    'config.ts',
    'redis.service.ts',
    'prisma.service.ts',
    'mock.ts',
    'cli.ts',
    'dev.*.ts',
  ],
};

export default config;
