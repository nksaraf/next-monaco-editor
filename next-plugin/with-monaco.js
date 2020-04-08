const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const withTM = require('next-transpile-modules')([
  // `monaco-editor` isn't published to npm correctly: it includes both CSS
  // imports and non-Node friendly syntax, so it needs to be compiled.
  'monaco-editor',
]);

module.exports = ({ languages = ['javascript', 'typescript'], ...monacoOptions } = {}) => (
  nextConfig = {}
) => {
  return withTM(
    Object.assign({}, nextConfig, {
      webpack(config, options) {
        const rule = config.module.rules
          .find(rule => rule.oneOf)
          .oneOf.find(
            r =>
              // Find the global CSS loader
              r.issuer && r.issuer.include && r.issuer.include.includes('_app')
          );
        if (rule) {
          rule.issuer.include = [
            rule.issuer.include,
            // Allow `monaco-editor` to import global CSS:
            /[\\/]node_modules[\\/]monaco-editor[\\/]/,
            // /[\\/]node_modules[\\/]next-monaco-editor[\\/]plugins[\\/]/,
          ];
        }

        config.module.rules.push({
          test: /\.monaco\.worker\.(js|ts)$/,
          use: [
            {
              loader: 'worker-loader',
              options: {
                name: 'static/[name].js',
                publicPath: '/_next/',
              },
            },
            {
              loader: 'babel-loader',
              options: {
                presets: ['next/babel'],
              },
            },
          ],
        });

        config.module.rules.push({
          test: /\.workerize\.(js|ts)$/,
          loader: 'workerize-loader',
          options: {
            name: 'static/[name].js',
            publicPath: '/_next/'
          }
        })

        config.output.globalObject = 'self';

        config.plugins.push(
          new MonacoWebpackPlugin({
            languages,
            filename: 'static/[name].monaco.worker.js',
            publicPath: '/_next/',
            ...monacoOptions
          })
        );

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    })
  );
};
