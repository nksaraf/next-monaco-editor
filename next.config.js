const withMonaco = require('./next-plugin/with-monaco');
module.exports = withMonaco({ languages: [ 'typescript', 'javascript'] })({
  webpack(config) {
    config.optimization.noEmitOnErrors = false;
    return config;
  },
  experimental: {
    jsconfigPaths: true
  }
});