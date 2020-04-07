import * as monaco from "monaco-editor";
import { languageDefinitions, LazyLanguageLoader } from './language-loader';

declare module "monaco-editor" {
  namespace languages {
    interface ILangWorker {
      label?: string;
      options?: any;
    }

    interface ILangWorkerConfig extends ILangWorker {
      languageId: string;
    }

    interface ILang extends monaco.languages.ILanguageExtensionPoint {
      loader?: () => Promise<ILangImpl>;
      worker?: ILangWorker | boolean;
    }
    
    interface ILangImpl {
      config: monaco.languages.LanguageConfiguration;
      language: monaco.languages.IMonarchLanguage;
    }
  }

  function getWorkerClient<T>(label: string): Promise<(...uris: monaco.Uri[]) => Promise<T>>;
  function addLanguage(languageDef: languages.ILang): void;
  function registerWorker(config: languages.ILangWorkerConfig): void;
  function getDefaultWorker(): Promise<any>;
  function getWorker(label: string): Promise<any>;
}


const getWorkerClient = async <T>(label: string): Promise<(...uris: monaco.Uri[]) => Promise<T>> => {
  const manager = await import('./worker-manager');
  return await manager.getWorkerClient(label);
}

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
    monaco.registerWorker({ languageId, ...config  });
  }
}

const registerWorker = ({ languageId, label = languageId, options = {} }: monaco.languages.ILangWorkerConfig) => {
  monaco.languages.onLanguage(languageId, () => {
    import("./worker-manager")
      .then((mod) => {
        mod.setupWorker({ languageId, label, options })
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });
}

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

