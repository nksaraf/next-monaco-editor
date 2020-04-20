import monaco from 'monaco';
import { asDisposable } from 'monaco/utils';

const parsers: { [key: string]: keyof typeof plugins } = {
  javascript: 'babel',
  typescript: 'babel-ts',
  markdown: 'markdown',
  graphql: 'graphql',
  json: 'json',
  mdx: 'mdx',
  html: 'html',
  angular: 'angular',
  vue: 'vue',
};

const plugins = {
  babel: ['parser-babel'],
  'babel-ts': ['parser-babel'],
  markdown: ['parser-markdown'],
  graphql: ['parser-graphql'],
  mdx: ['parser-markdown'],
  html: ['parser-html'],
  angular: ['parser-html'],
  vue: ['parser-html'],
  json: ['parser-babel'],
};

export const prettier = (
  languages: (
    | keyof typeof parsers
    | { [key: string]: keyof typeof plugins }
  )[] = [], options: any = {}
) => (api: typeof monaco) => {
  let disposables: monaco.IDisposable[] = [];
  languages.forEach((langauge) => {
    if (typeof langauge === 'string') {
      disposables.push(api.worker.register({
        languageId: langauge,
        label: 'prettier',
        providers: {
          documentFormattingEdit: true,
        },
        options: {
          parser: parsers[langauge],
          plugins: plugins[parsers[langauge]],
          ...options
        },
      }));
    } else if (typeof langauge === 'object') {
      Object.keys(langauge).forEach((languageId) => {
        disposables.push(api.worker.register({
          languageId: languageId,
          label: 'prettier',
          providers: {
            documentFormattingEdit: true,
          },
          options: {
            parser: langauge[languageId],
            plugins: plugins[langauge[languageId]],
            ...options
          },
        }));
      });
    }
  });
  return asDisposable(disposables);
};


