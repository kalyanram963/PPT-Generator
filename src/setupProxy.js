const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Add any API proxies you need here
  // Example:
  // app.use(
  //   '/api',
  //   createProxyMiddleware({
  //     target: 'http://localhost:5000',
  //     changeOrigin: true,
  //   })
  // );
  
  // This empty configuration helps prevent Node core module errors
  // by ensuring the development server runs in browser-compatible mode
};