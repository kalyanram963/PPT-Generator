module.exports = function override(config, env) {
  config.resolve.fallback = {
    fs: false,
    https: false,
    http: false,
    stream: false,
    zlib: false
  };
  return config;
}