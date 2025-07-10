// config-overrides.js
module.exports = function override(config, env) {
  const eslintWebpackPlugin = config.plugins.find(
    (plugin) => plugin.constructor.name === 'ESLintWebpackPlugin'
  );

  if (eslintWebpackPlugin) {
    eslintWebpackPlugin.options.failOnWarning = false;
  }

  return config;
};
