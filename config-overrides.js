const { injectBabelPlugin } = require('react-app-rewired');
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = function(config, env) {
  
  // Essential features
  config = injectBabelPlugin('transform-class-properties', config);
  config = injectBabelPlugin('transform-decorators-legacy', config);
  
  // React Hot Loader
  config = rewireReactHotLoader(config, env);
  
  return config;
};
