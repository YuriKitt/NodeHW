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
    ]
  };
  