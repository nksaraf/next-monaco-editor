import * as monaco from 'monaco-editor';
import { languageDefinitions, LazyLanguageLoader } from './language-loader';
import { setupWorker, getWorkerClient } from './worker-manager';
import { defaultProviderConfig } from './providers';

declare module 'monaco-editor' {
  namespace worker {
    interface IProvidersConfig {
      getWorker: IWorkerAccessor<any>
      languageId: string;
      providers?: ILangWorkerProviders | boolean;
    }
    interface ILangWorkerProviders {
      reference?: boolean;
      rename?: boolean;
      signatureHelp?: boolean;
      hover?: boolean;
      documentSymbol?: boolean;
      documentHighlight?: boolean;
      definition?: boolean;
      implementation?: boolean;
      typeDefinition?: boolean;
      codeLens?: boolean;
      codeAction?: boolean;
      documentFormattingEdit?: boolean;
      documentRangeFormattingEdit?: boolean;
      onTypeFormattingEdit?: boolean;
      link?: boolean;
      completionItem?: boolean;
      completionTriggerCharacters?: string[];
      color?: boolean;
      foldingRange?: boolean;
      declaration?: boolean;
      selectionRange?: boolean;
      // documentSemanticTokens?: boolean
      // documentRangeSemanticTokens?: boolean
    }
    
    interface IWorkerAccessor<T> {
      (...uris: monaco.Uri[]): Promise<T>;
    }

    interface ILangWorkerConfig {
      label?: string;
      languageId?: string;
      // to be passed on to the worker
      options?: any;
      /* if boolean, all providers registered/not-registered, 
      if object, more control over which specific providers are registered */
      providers?: boolean | ILangWorkerProviders;
      onRegister?: (getWorker: IWorkerAccessor<any>, monacoApi: typeof monaco) => void;
    }

    function register(config: worker.ILangWorkerConfig): void;
    function getClient<T>(
      label: string
    ): Promise<(...uris: monaco.Uri[]) => Promise<T>>;
  
    // provided in MonacoEditor.tsx
    function getDefault(): Promise<any>;
    function get(label: string): Promise<any>;
  }

  namespace editor  {
    interface IEditorOptions {
      formatOnSave?: boolean;
    }
  }

  namespace languages {
    interface ILang extends monaco.languages.ILanguageExtensionPoint {
      // eg. () => import('./typescript');
      loader?: () => Promise<ILangImpl>;
      // if true, worker with languageId as label is registered
      worker?: Omit<worker.ILangWorkerConfig, 'languageId'> | boolean;
    }

    interface ILangImpl {
      config: monaco.languages.LanguageConfiguration;
      language: monaco.languages.IMonarchLanguage;
    }
  }

  // provided in this file
  function registerLanguage(languageDef: languages.ILang): void;
}

const registerLanguage = (language: monaco.languages.ILang) => {
  const languageId = language.id;
  languageDefinitions[languageId] = language;

  monaco.languages.register(language);

  if (language.loader) {
    const lazyLanguageLoader = LazyLanguageLoader.getOrCreate(languageId);
    monaco.languages.setMonarchTokensProvider(
      languageId,
      lazyLanguageLoader
        .whenLoaded()
        .then((mod) => mod.language as any)
        .catch((e) => {
          console.error(e);
          return;
        })
    );

    monaco.languages.onLanguage(languageId, () => {
      lazyLanguageLoader
        .load()
        .then((mod) => {
          if (mod && mod.config) {
            monaco.languages.setLanguageConfiguration(languageId, mod.config);
          }
        })
        .catch((err) => {
          console.error(err);
          return;
        });
    });
  }

  if (language.worker) {
    const config = typeof language.worker === 'object' ? language.worker : {};
    monaco.worker.register({ languageId, ...config });
  }
};

const registerWorker = ({
  languageId,
  label = languageId,
  options = {},
  providers = defaultProviderConfig,
  onRegister,
}: monaco.worker.ILangWorkerConfig) => {
  if (languageId) {
    monaco.languages.onLanguage(languageId, () => {
      setupWorker({
        languageId,
        label,
        options,
        providers,
        onRegister,
      });
    });
  } else {
    setupWorker({ languageId, label, options, providers, onRegister });
  }
};


Object.assign(monaco, { worker: { register: registerWorker, getClient: getWorkerClient }, registerLanguage});

export { monaco };
export default monaco;

// registerLanguage({
// 	id: 'typescript',
// 	extensions: ['.ts', '.tsx'],
// 	aliases: ['TypeScript', 'ts', 'typescript'],
// 	mimetypes: ['text/typescript'],
// 	loader: () => <Promise<any>>import('./typescript')
// });
