const withMonaco = require('./dist/cjs/next');
module.exports = withMonaco({ languages: ['typescript', 'json', 'yaml'] })({
  experimental: {
    jsconfigPaths: true,
  },
});
