const path = require('path');
const ignoreImport = require('rollup-plugin-ignore-import');
// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    const { output, ...restConfig } = config;
    const { file, ...restOutput } = output;
    const base = path.join(__dirname, 'dist', options.name, options.format);
    const dir = options.env ? path.join(base, options.env) : base;
    // console.log(restConfig.external);
    if (options.name === 'plugins') {
    restConfig.external = (id, parent, isResolved) => { return id.endsWith('.monaco.worker.ts') || id.endsWith('.monaco.worker.js') || !isResolved }
      
    }
    // console.log(output, config);
    // Remove file ref and insert dir to support React.lazy();
    return {
      ...restConfig,
      output: {
        ...restOutput,
        // file,
        // inlineDynamicImports: true,
        dir
      },
    }; // always return a config.
  },
};