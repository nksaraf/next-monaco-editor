import * as monaco from 'monaco-editor';

export const languageDefinitions: {
  [languageId: string]: monaco.languages.ILang;
} = {};
export const lazyLanguageLoaders: {
  [languageId: string]: LazyLanguageLoader;
} = {};

export class LazyLanguageLoader {
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
        mod => this._lazyLoadPromiseResolve(mod),
        err => this._lazyLoadPromiseReject(err)
      );
    }
    return this._lazyLoadPromise;
  }
}
