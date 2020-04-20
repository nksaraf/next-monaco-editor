import monaco from 'monaco';

export const uniroll = () => (api: typeof monaco) => {
  api.worker.register({
    languageId: 'typescript',
    label: 'uniroll',
    providers: false,
  });
};
