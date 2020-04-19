import monaco from 'next-monaco-editor/api';

export const graphql = (settings: any) => (api: typeof monaco) => {
  api.registerLanguage({
    id: 'graphql',
    extensions: ['.graphql', '.gql'],
    aliases: ['graphql'],
    mimetypes: ['application/graphql', 'text/graphql'],
    loader: () => import('./graphql') as any,
    worker: {
      providers: {
        hover: true,
        completionItem: true,
        completionTriggerCharacters: [' ', ':', '(', '\n', '\t'],
        diagnostics: true,
      },
      options: {
        options: settings,
      },
    },
  });
};
