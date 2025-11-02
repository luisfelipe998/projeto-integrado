module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/integration'],
  testMatch: ['**/tests/integration/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 120000, // 2 minutes timeout for integration tests
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'artifacts/integration',
  globals: {
    'ts-jest': {
      useESM: false
    }
  },
  setupFiles: ['<rootDir>/tests/integration/jest-setup.js']
};
