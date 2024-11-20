module.exports = {
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/coverage/'],
  testPathIgnorePatterns: ['/node_modules/'],
};
