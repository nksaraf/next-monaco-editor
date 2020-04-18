const withMonaco = require('./next-plugin/with-monaco');
module.exports = withMonaco({ languages: [ 'typescript', 'json', 'yaml' ] })({
  experimental: {
    jsconfigPaths: true
  }
});