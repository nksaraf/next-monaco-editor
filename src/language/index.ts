import monaco from "../api";

const languageDefinitions: { [languageId: string]: monaco.languages.ILang } = {};
const lazyLanguageLoaders: { [languageId: string]: LazyLanguageLoader } = {};

class LazyLanguageLoader {
  public static getOrCreate(languageId: string): LazyLanguageLoader {
    if (!lazyLanguageLoaders[languageId]) {
      lazyLanguageLoaders[languageId] = new LazyLanguageLoader(languageId);
    }
    return lazyLanguageLoaders[languageId];
  }

  private readonly _languageId: string;
  private _loadingTriggered: boolean;
  private _lazyLoadPromise: Promise<monaco.languages.ILangImpl>;
  private _lazyLoadPromiseResolve!: (value: monaco.languages.ILangImpl) => void;
  private _lazyLoadPromiseReject!: (err: any) => void;

  constructor(languageId: string) {
    this._languageId = languageId;
    this._loadingTriggered = false;
    this._lazyLoadPromise = new Promise((resolve, reject) => {
      this._lazyLoadPromiseResolve = resolve;
      this._lazyLoadPromiseReject = reject;
    });
  }

  public whenLoaded(): Promise<monaco.languages.ILangImpl> {
    return this._lazyLoadPromise;
  }

  public load(): Promise<monaco.languages.ILangImpl> {
    if (!this._loadingTriggered) {
      this._loadingTriggered = true;
      languageDefinitions[this._languageId].loader().then(
        (mod) => this._lazyLoadPromiseResolve(mod),
        (err) => this._lazyLoadPromiseReject(err)
      );
    }
    return this._lazyLoadPromise;
  }
}


monaco.languages.getWorker = async <T>(languageID: string): Promise<(...uris: monaco.Uri[]) => Promise<T>> => {
  if (languageID === 'typescript') {
    return await monaco.languages.typescript.getTypeScriptWorker() as any;
  }
  if (languageID === 'javascript') {
    return await monaco.languages.typescript.getJavaScriptWorker() as any;
  }
  const manager = await import('./worker-manager');
  return await manager.getWorker(languageID);
}

monaco.languages.addLanguage = (languageDef: monaco.languages.ILang) => {
  const languageId = languageDef.id;
  languageDefinitions[languageId] = languageDef;
  monaco.languages.register(languageDef);

  if (languageDef.loader) {
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
          if (mod && mod.conf) {
            monaco.languages.setLanguageConfiguration(languageId, mod.conf);
          }
        })
        .catch((err) => {
          console.error(err);
          return;
        });
    });
  }

  if (languageDef.worker) {
    monaco.languages.onLanguage(languageId, () => {
      import("./worker-manager")
        .then((mod) => {
          mod.setupWorker({ ...languageDef, languageId })
        })
        .catch((err) => {
          console.error(err);
          return;
        });
    });
  }
}

export { monaco };

// registerLanguage({
// 	id: 'typescript',
// 	extensions: ['.ts', '.tsx'],
// 	aliases: ['TypeScript', 'ts', 'typescript'],
// 	mimetypes: ['text/typescript'],
// 	loader: () => <Promise<any>>import('./typescript')
// });
