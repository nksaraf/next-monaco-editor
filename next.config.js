const withMonaco = require('./next-monaco');
module.exports = withMonaco({ languages: ['typescript', 'json', 'yaml'] })({
  experimental: {
    jsconfigPaths: true,
    reactRefresh: true,
  },
});
