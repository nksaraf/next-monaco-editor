module.exports = {
  typecheck: false,
  silent: true,
  entries: [
    'monaco',
    'worker',
    'themes',
    'hooks',

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
      name: 'editor',
      source: './lib/components/Editor.tsx',
    },
    {
      name: 'split-panes',
      source: './lib/components/SplitPanes.tsx',
    },
    {
      name: 'json-viewer',
      source: './lib/components/JSONViewer.tsx',
    },
  ],
  target: 'browser',
  preBuild: async (toolbox, config) => {
    try {
      // toolbox.system.run(
      //   'cd ./node_modules/react && yarn link && cd ../react-dom && yarn link && cd ../monaco-editor && yarn link'
      // );
      const files = toolbox.filesystem
        .find('.', { matching: ['**/*.monaco.worker.ts'] })
        .map((f) => [f, toolbox.path.basename(f)]);
      console.log(files);
    } catch (e) {
      console.log(e);
    }
  },
};
