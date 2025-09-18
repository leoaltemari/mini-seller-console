module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    transform: {
      tsconfig: [
        'ts-jest',
        {
          tsconfig: '<rootDir>/tsconfig.jest.json',
          stringifyContentPathRegex: '\\.html$',
        },
      ],
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/jest.setup.ts'],
  moduleNameMapper: {
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@models/(.*)$': '<rootDir>/src/shared/models/$1',
    '^@constants/(.*)$': '<rootDir>/src/shared/constants/$1',
    '^@utils/(.*)$': '<rootDir>/src/shared/utils/$1',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
