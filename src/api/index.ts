import * as monaco from "monaco-editor";
import '../language';

declare module "monaco-editor" {
  namespace languages {
    interface ILang extends monaco.languages.ILanguageExtensionPoint {
      loader?: () => Promise<ILangImpl>;
      worker?: boolean;
      workerConfig?: any;
    }
    
    interface ILangImpl {
      conf: monaco.languages.LanguageConfiguration;
      language: monaco.languages.IMonarchLanguage;
    }
    
    export function getWorker<T>(languageID: string): Promise<(...uris: monaco.Uri[]) => Promise<T>>;
    export function addLanguage(languageDef: ILang): void;
  }

  function getModelWorker(): Promise<any>;
}

export default monaco;
export { monaco };