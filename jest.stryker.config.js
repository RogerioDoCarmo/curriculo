/**
 * Jest configuration used by Stryker mutation testing.
 *
 * Identical to the main jest.config.js, except testEnvironment is given as an
 * absolute path. Stryker's jest-runner loads the environment via require.resolve
 * and does not expand the "<rootDir>" token that jest.config.js relies on, so it
 * would otherwise fail with "Cannot find module '<rootDir>/jest.environment.js'".
 */
const path = require("path");
const baseConfig = require("./jest.config");

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  testEnvironment: path.resolve(__dirname, "jest.environment.js"),
};
