import monaco from '../api';

const parsers = {
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

export const prettier = (languages: any = []) => (api: typeof monaco) => {
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
          }
        });
      })
    } 
  });
}