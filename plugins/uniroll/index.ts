import monaco from 'next-monaco-editor/api';

export const uniroll = () => (api: typeof monaco) => {
  api.worker.register({
    languageId: 'typescript',
    label: 'uniroll',
    providers: false,
  });
};
