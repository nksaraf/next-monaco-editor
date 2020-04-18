const withMonaco = require('./next-plugin/with-monaco');
module.exports = withMonaco({ languages: [ 'graphql', 'typescript', 'json', 'yaml' ] })({
  experimental: {
    jsconfigPaths: true
  }
});