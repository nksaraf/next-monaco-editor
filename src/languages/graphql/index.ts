import './graphql.monaco.worker';
import 'next-monaco-editor/plugins/prettier.monaco.worker';
import monaco from 'next-monaco-editor/api';
import { prettier } from 'next-monaco-editor/plugins';

export default (api: typeof monaco, schemaUrl:  string) => {
  api.registerLanguage({
    id: 'graphql',
    extensions: ['.graphql', '.gql'],
    aliases: ['graphql'],
    mimetypes: ['application/graphql', 'text/graphql'],
    loader: () =>
      import('monaco-languages/release/esm/graphql/graphql'),
      worker: {
        providers: {
          hover: true,
          completionItem: true,
          completionTriggerCharacters: [' ', ':', '(', '\n']
        },
        options: {
          uri: schemaUrl
        }
      }
  });
  prettier(['graphql'])(api);
}
