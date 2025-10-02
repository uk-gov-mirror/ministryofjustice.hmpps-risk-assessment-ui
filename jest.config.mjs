export default {
  setupFilesAfterEnv: ['./test-helpers/setup.js'],
  collectCoverageFrom: ['common/**/*.js'],
  testMatch: ['<rootDir>/(common)/**/?(*.)(test).js', '<rootDir>/(app)/**/?(*.)(test).js'],
  testEnvironment: 'node',
  transform: {},
}
