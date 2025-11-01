module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/tests/integration/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 120000, // 2 minutes timeout for integration tests
  setupFilesAfterEnv: [],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'artifacts/integration'
};
