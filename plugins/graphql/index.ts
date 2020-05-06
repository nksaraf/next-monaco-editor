import monaco from '@monaco';

export const graphql = (settings: any) => (api: typeof monaco) => {
  return api.languages.register({
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
