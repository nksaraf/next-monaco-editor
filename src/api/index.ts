import * as monaco from 'monaco-editor';
import { languageDefinitions, LazyLanguageLoader } from './language-loader';
import {  setupWorker } from './worker-manager';
import {  defaultProviderConfig } from './providers';

declare module 'monaco-editor' {
  namespace languages {
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
      color?: boolean;
      foldingRange?: boolean;
      declaration?: boolean;
      selectionRange?: boolean;
      // documentSemanticTokens?: boolean
      // documentRangeSemanticTokens?: boolean
    }

    interface IGetWorker<T> {
      (...uris: monaco.Uri[]): Promise<T>;
    }

    interface ILangWorkerConfig {
      label?: string;
      languageId?: string;
      options?: any;
      providers?: boolean | ILangWorkerProviders;
      onRegister?: (getWorker: IGetWorker<any>) => void;
    }

    interface ILang extends monaco.languages.ILanguageExtensionPoint {
      loader?: () => Promise<ILangImpl>;
      worker?: Omit<ILangWorkerConfig, 'languageId'> | boolean;
    }

    interface ILangImpl {
      config: monaco.languages.LanguageConfiguration;
      language: monaco.languages.IMonarchLanguage;
    }
  }

  function getWorkerClient<T>(
    label: string
  ): Promise<(...uris: monaco.Uri[]) => Promise<T>>;
  function addLanguage(languageDef: languages.ILang): void;
  function registerWorker(config: languages.ILangWorkerConfig): void;
  function getDefaultWorker(): Promise<any>;
  function getWorker(label: string): Promise<any>;
}

const getWorkerClient = async <T>(
  label: string
): Promise<(...uris: monaco.Uri[]) => Promise<T>> => {
  const manager = await import('./worker-manager');
  return await manager.getWorkerClient(label);
};

const addLanguage = (language: monaco.languages.ILang) => {
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
    monaco.registerWorker({ languageId, ...config });
  }
};

const registerWorker = ({
  languageId,
  label = languageId,
  options = {},
  providers = defaultProviderConfig,
  onRegister,
}: monaco.languages.ILangWorkerConfig) => {
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

Object.assign(monaco, { addLanguage, registerWorker, getWorkerClient });

export { monaco };
export default monaco;

// registerLanguage({
// 	id: 'typescript',
// 	extensions: ['.ts', '.tsx'],
// 	aliases: ['TypeScript', 'ts', 'typescript'],
// 	mimetypes: ['text/typescript'],
// 	loader: () => <Promise<any>>import('./typescript')
// });
