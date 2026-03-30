const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const dotenv = require('dotenv');
const { defineConfig } = require('cypress');

async function getConfigurationByFile(file) {
  if (!file) {
    return {};
  }

  const pathToConfigFile = path.resolve(`cypress.${file}.json`);
  if (!(await fs.pathExists(pathToConfigFile))) {
    return {};
  }

  return fs.readJson(pathToConfigFile);
}

async function readEnvVars() {
  const config = {};
  const appRoot = await fs.realpath(process.cwd());
  const envPaths = [path.resolve(appRoot, '.env')];
  const envObjects = [];

  for (const envPath of envPaths) {
    if (!(await fs.pathExists(envPath))) {
      continue;
    }
    const envFile = await fs.readFile(envPath, 'utf8');
    envObjects.push(dotenv.parse(envFile));
  }

  const combinedFiles = _.merge({}, ...envObjects);
  const CYPRESS_PREFIX = /^CYPRESS_/i;

  Object.entries(combinedFiles).forEach(([key, value]) => {
    config[key] = value;
  });

  for (const [envName, envValue] of Object.entries(process.env)) {
    if (envName.match(CYPRESS_PREFIX)) {
      config[envName] = envValue;
    }
  }

  return config;
}

async function setupNodeEvents(on, config) {
  const configFile = config.env.configFile || '';
  const envVars = await readEnvVars();
  const envConfig = await getConfigurationByFile(configFile);

  return _.merge({}, config, { env: envVars }, envConfig);
}

module.exports = defineConfig({
  apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:4000',
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    numTestsKeptInMemory: 1,
    projectId: '3o6x11',
    specPattern: 'cypress/integration/**/*.spec.js',
    supportFile: 'cypress/support/index.js',
    setupNodeEvents,
    viewportWidth: 800,
    viewportHeight: 1100,
    video: true,
  },
});
