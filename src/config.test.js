const loadConfig = () => {
  let config;
  jest.isolateModules(() => {
    // eslint-disable-next-line global-require
    config = require('./config').default;
  });
  return config;
};

afterEach(() => {
  delete window.PublisherUiConfig;
});

it('uses runtime values from window.PublisherUiConfig', () => {
  window.PublisherUiConfig = {
    REACT_APP_API_URL: 'https://runtime.example/julkaisin-api',
    REACT_APP_CLIENT_ID: 'runtime-client',
  };
  const config = loadConfig();
  expect(config.apiUrl).toBe('https://runtime.example/julkaisin-api');
  expect(config.clientId).toBe('runtime-client');
});

it('falls back to build-time env when a runtime value is missing', () => {
  window.PublisherUiConfig = {};
  const config = loadConfig();
  expect(config.joreApiUrl).toBe(process.env.REACT_APP_JORE_API_URL);
  expect(config.namespace).toBe(process.env.REACT_APP_NAMESPACE);
});

it('works without any runtime config', () => {
  const config = loadConfig();
  expect(config.apiUrl).toBe(process.env.REACT_APP_API_URL);
});
