import monaco from 'monaco';

const extraLibs = new Map();

declare module "monaco-editor" {
  namespace languages.typescript {
    export const loadTypes: (name: string, version: string) => Promise<{ [key: string]: string }>;
    export const addGlobal: (code: string) => void;
  }
}


export const typings = (
  compilerOptions: monaco.languages.typescript.CompilerOptions = {}
) => (api: typeof monaco) => {
  let disposable = api.worker.register({
    label: 'typings',
    providers: false,
  });
  api.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  api.languages.typescript.javascriptDefaults.setEagerModelSync(true);

  const defaultCompilerOptions = {
    allowJs: true,
    allowSyntheticDefaultImports: true,
    alwaysStrict: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    // isolatedModules: true,
    jsx: api.languages.typescript.JsxEmit.React,
    module: api.languages.typescript.ModuleKind.ESNext,
    moduleResolution: api.languages.typescript.ModuleResolutionKind.NodeJs,
    noEmit: true,
    resolveJsonModule: true,
    strict: true,
    target: api.languages.typescript.ScriptTarget.ESNext,
    ...compilerOptions,
  };
  api.languages.typescript.typescriptDefaults.setCompilerOptions(
    defaultCompilerOptions
  );
  api.languages.typescript.typescriptDefaults.setCompilerOptions(defaultCompilerOptions);


  Object.assign(api.languages.typescript, {
    loadTypes: async (name: string, version: string) => {
      const worker = await api.worker.get('typings');
      const { typings } = await worker.fetchTypings(name, version);
      Object.keys(typings).forEach((path) => {
        let extraLib = extraLibs.get(path);
        extraLib && extraLib.dispose();
        extraLib = api.languages.typescript.typescriptDefaults.addExtraLib(
          typings[path],
          api.Uri.from({ scheme: 'file', path }).toString()
        );
        extraLib = api.languages.typescript.javascriptDefaults.addExtraLib(
          typings[path],
          api.Uri.from({ scheme: 'file', path }).toString()
        );
        extraLibs.set(path, extraLib);
      });
      return typings;
    },
    addGlobal: (code: string) => {
      // const currentLib = api.languages.typescript.javascriptDefaults.getExtraLibs();
      // console.log(currentLib);
      api.languages.typescript.typescriptDefaults.addExtraLib(
        code,
        api.Uri.file('global.d.ts').toString()
      );
      api.languages.typescript.javascriptDefaults.addExtraLib(
        code,
        api.Uri.file('global.d.ts').toString()
      );
      

    }
  });

  return disposable;
};
