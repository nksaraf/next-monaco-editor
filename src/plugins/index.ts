import monaco from '../api';

export const prettier = (languages = ['javascript', 'typescript']) => (api: typeof monaco) => {
  languages.forEach(langauge => {
    api.registerWorker({
      languageId: langauge,
      label: 'prettier',
      providers: {
        documentFormattingEdit: true
      }
    })
  });
}