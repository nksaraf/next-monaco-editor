import monaco from '../api';

const parsers : { [key: string ]: keyof typeof plugins} = {
  javascript: 'babel',
  typescript: 'babel-ts',
  markdown: "markdown",
  graphql: "graphql",
  json: "json",
  mdx: "mdx",
  html: "html",
  angular: "angular",
  vue: "vue"
}

const plugins = {
  'babel': ['parser-babel'],
  'babel-ts': ['parser-babel'],
  'markdown': ['parser-markdown'],
  'graphql': ['parser-graphql'],
  'mdx': ['parser-markdown'],
  'html': ['parser-html'],
  'angular': ['parser-html'],
  'vue': ['parser-html'],
  'json': ["parser-babel"],
}

export const prettier = (languages: (keyof typeof parsers | { [key:  string]: (keyof typeof plugins) })[] = []) => (api: typeof monaco) => {
  languages.forEach(langauge => {
    if (typeof langauge === 'string') {
      api.worker.register({
        languageId: langauge,
        label: 'prettier',
        providers: {
          documentFormattingEdit: true
        },
        options: {
          parser: parsers[langauge],
          plugins: plugins[parsers[langauge]] 
        }
      });
    } else if (typeof langauge === 'object') {
      Object.keys(langauge).forEach(languageId => {
        api.worker.register({
          languageId: languageId,
          label: 'prettier',
          providers: {
            documentFormattingEdit: true
          },
          options: {
            parser: langauge[languageId],
            plugins: plugins[langauge[languageId]] 
          }
        });
      })
    } 
  });
}