import monaco from 'next-monaco-editor/api';

export const faunadb = (
  // compilerOptions: monaco.languages.typescript.CompilerOptions = {}
) => (api: typeof monaco) => {
  api.worker.register({
    label: 'faunadb',
    providers: false,
  });
};
