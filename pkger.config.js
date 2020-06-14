const magic = require('magic-components/babel');

module.exports = {
  typecheck: true,
  silent: true,
  entries: [
    'worker',
    'themes',
    {
      name: 'next',
      target: 'node',
    },
    {
      name: 'MonacoEditor',
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
  ],
  babel: (config, options) => {
    return {
      ...config,
      plugins: [magic, ...config.plugins],
    };
  },
  target: 'browser',
  rollup: (config, options) => {
    const external = config.external;
    config.external = (imported, importer) => {
      const ext = external(imported, importer);
      if (imported.startsWith('@') && !(imported.indexOf('/') >= 0)) {
        return true;
      }
      return ext;
    };
    return config;
  },
  postBuild: async (toolbox) => {
    for (var path of toolbox.filesystem.find('dist', {
      matching: ['cjs/**/*.js', 'esm/**/*.js'],
    })) {
      await toolbox.patching.update(path, (data) => {
        return data
          .replace('@MonacoEditor', './MonacoEditor')
          .replace(/[\'\"]@([A-Za-z\-]+)[\'\"]/, (a, b) => {
            return `'./${b}'`;
          });
      });
    }

    const entry = Object.fromEntries(
      toolbox.config.allEntries.map((o) => [
        o.entryName,
        toolbox.path.join(process.cwd(), o.source),
      ])
    );

    const other = (path, b) => {
      if (entry[b]) {
        const myPath = toolbox.path.dirname(
          toolbox.path.join(
            process.cwd(),
            path.replace('dist/types', 'lib').replace('.d.ts', '.ts')
          )
        );
        let relPath = toolbox.path.from(myPath, entry[b]);
        if (relPath.endsWith('index.ts') || relPath.endsWith('index.tsx')) {
          relPath = toolbox.path.dirname(relPath);
        }
        // console.log(myPath, entry[b], toolbox.path.from(myPath, entry[b]));
        return `'./${relPath}'`;
      }
      return b;
    };

    for (var path of toolbox.filesystem.find('dist', {
      matching: ['types/**/*.d.ts'],
    })) {
      await toolbox.patching.update(path, (data) => {
        return data.replace(/[\'\"]@([a-zA-Z\-]+)[\'\"]/, (a, b) =>
          other(path, b)
        );
      });
    }

    try {
      for (var i of toolbox.config.allEntries) {
        if (i.entryName) {
          await toolbox.patching.update(
            toolbox.path.join(process.cwd(), i.entryName, 'package.json'),
            (data) => {
              return {
                ...data,
                types: toolbox.path.join(
                  data.types,
                  i.source.replace('lib/', '').replace(/\.tsx?/, '')
                ),
              };
            }
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
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
