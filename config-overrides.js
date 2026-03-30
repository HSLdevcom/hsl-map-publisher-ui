const { override, addBabelPlugin } = require('customize-cra');

// Patch react-scripts' webpackDevServer config to use the new setupMiddlewares
// API instead of the deprecated onBeforeSetupMiddleware/onAfterSetupMiddleware.
// react-scripts 5 still uses the old API, causing deprecation warnings in
// webpack-dev-server 4.7+.
const patchDevServer = configFn => (...args) => {
  const config = configFn(...args);
  const { onBeforeSetupMiddleware, onAfterSetupMiddleware, ...rest } = config;
  return {
    ...rest,
    setupMiddlewares(middlewares, devServer) {
      if (onBeforeSetupMiddleware) {
        onBeforeSetupMiddleware(devServer);
      }
      if (onAfterSetupMiddleware) {
        onAfterSetupMiddleware(devServer);
      }
      return middlewares;
    },
  };
};

// Suppress source-map-loader warnings from node_modules that ship broken
// source maps (e.g. react-slidedown references .jsx files it doesn't publish).
const ignoreSourceMapWarnings = config => ({
  ...config,
  ignoreWarnings: [...(config.ignoreWarnings || []), /Failed to parse source map/],
});

module.exports = {
  webpack: override(
    addBabelPlugin(['@babel/plugin-proposal-decorators', { legacy: true }]),
    ignoreSourceMapWarnings,
  ),
  devServer: patchDevServer,
};
