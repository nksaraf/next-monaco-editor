module.exports = {
  typecheck: true,
  silent: true,
  entries: [
    'monaco',
    'worker',
    'themes',
    {
      name: 'next',
      target: 'node',
    },
    {
      name: 'monaco-editor',
      source: './lib/components/MonacoEditor.tsx',
    },
    {
      name: 'plugins',
      source: './lib/plugins/index.ts',
    },
    {
      name: 'prettier.monaco.worker',
      source: './lib/plugins/prettier/prettier.monaco.worker.ts',
      format: 'esm',
    },
    {
      name: 'typings.monaco.worker',
      source: './lib/plugins/typings/typings.monaco.worker.js',
      format: 'esm',
    },
    // {
    //   name: 'editor',
    //   source: './lib/components/Editor.tsx',
    // },
    // {
    //   name: 'split-panes',
    //   source: './lib/components/SplitPanes.tsx',
    // },
    // {
    //   name: 'components/JSONViewer',
    //   // source: './lib/components/JSONViewer.tsx',
    // },
  ],
  target: 'browser',
  // rollup: (config, options) => {
  //   // if (options.entryName && options.entryName.endsWith('.monaco.worker')) {
  //   //   // config.external
  //   }

  //   return config;
  // },
  // preBuild: async (toolbox) => {
  //   const path = require('path');

  //   await new (require('npm-dts').Generator)(
  //     {
  //       entry: './lib/monaco/index.ts',
  //       root: path.resolve(process.cwd()),
  //       logLevel: 'debug',
  //       throwOnErrors: true,
  //       // tmp: path.resolve(process.cwd(), 'cache/tmp'),
  //       tsc: '-p tsconfig.build.json',
  //     },
  //     true
  //   ).generate();

  //   process.exit(0);
  // },
};

// preBuild: async (toolbox, config) => {
//   try {
//     // toolbox.system.run(
//     //   'cd ./node_modules/react && yarn link && cd ../react-dom && yarn link && cd ../monaco-editor && yarn link'
//     // );
//     toolbox.filesystem
//       .find('.', { matching: ['lib/**/*.monaco.worker.{ts,js}'] })
//       .map((f) => [f, toolbox.path.basename(f)])
//       .forEach(async (paths) => {
//         console.log(paths);
//         toolbox.filesystem.copy(paths[0], 'workers/' + paths[1], {
//           overwrite: true,
//         });
//         await toolbox.patching.replace(
//           'workers/' + paths[1],
//           /@([a-z\-]+)/g,
//           (a, b) => '../' + b
//         );
//         await toolbox.patching.prepend(
//           'workers/' + paths[1],
//           '// @ts-nocheck'
//         );
//       });
//   } catch (e) {
//     console.log(e);
//   }
