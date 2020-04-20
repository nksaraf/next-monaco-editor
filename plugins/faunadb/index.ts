import monaco from 'monaco';

export const faunadb = (
  // compilerOptions: monaco.languages.typescript.CompilerOptions = {}
) => (api: typeof monaco) => {
  return api.worker.register({
    label: 'faunadb',
    providers: false,
  });
};
