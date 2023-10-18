/** @type {import('jest').Config} */
const config = {
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ['<rootDir>/tests/setupTests.js'],
  testURL: 'http://localhost:8999',
  testMatch: ['<rootDir>/tests/*/*.spec.js'],
  testEnvironmentOptions: {
    pretendToBeVisual: true
  },
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**'],
  coverageReporters: ['text', 'text-summary']
};

module.exports = config;
