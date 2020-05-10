import monaco from '@monaco';
import { LanguageService } from './language-service';
export const graphql = (settings: any) => (api: typeof monaco) => {
  return api.languages.register({
    id: 'graphql',
    extensions: ['.graphql', '.gql'],
    aliases: ['graphql'],
    mimetypes: ['application/graphql', 'text/graphql'],
    loader: () => import('./graphql.language') as any,
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
