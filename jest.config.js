module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).js?(x)'], // Matches test files
    collectCoverageFrom: [
      'src/**/*.{js,jsx}', // Include source files
      '!src/**/*.d.ts',    // Exclude declaration files
    ],
    coveragePathIgnorePatterns: [
      '/node_modules/'     // Exclude node modules
    ],
  };