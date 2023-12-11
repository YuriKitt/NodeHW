module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    "<rootDir>/src/tests"
  ],
  testMatch: [
    "**/*.test.ts"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setup.ts"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
