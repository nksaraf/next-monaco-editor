const withMonaco = require('./next-plugin/with-monaco');
module.exports = withMonaco({ languages: [ 'graphql' ] })({
  experimental: {
    jsconfigPaths: true
  }
});