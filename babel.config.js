module.exports = function (api) {
  api.cache(true);

  return {
    presets: [require.resolve('babel-preset-react-app')],
    plugins: [[require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }]],
  };
};
