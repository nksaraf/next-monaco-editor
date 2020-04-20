/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as monaco from 'monaco-editor';
import { defaultProviderConfig, setupWorkerProviders } from './providers';

declare module 'monaco-editor' {
  namespace worker {
    interface ILangProvidersOptions {
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
      // via diagnostics provider
      diagnostics?: boolean;
      // documentSemanticTokens?: boolean
      // documentRangeSemanticTokens?: boolean
    }

    interface IWorkerAccessor<TWorker> {
      (...uris: monaco.Uri[]): Promise<TWorker>;
    }

    interface IWorkerConfig<TOptions> {
      label?: string;
      languageId?: string;
      // to be passed on to the worker
      options?: TOptions;
      /* if boolean, all providers registered/not-registered, 
      if object, more control over which specific providers are registered */
      providers?: boolean | ILangProvidersOptions;
    }

    interface IWorkerRegistrationOptions<T> extends IWorkerConfig<T> {
      onRegister?: (
        client: WorkerClient<T, any>,
        monacoApi: typeof monaco
      ) => void;
    }

    function register<TOptions>(
      config: worker.IWorkerConfig<TOptions>
    ): monaco.IDisposable;

    function getClient<TOptions, TWorker extends any>(label: string): WorkerClient<TOptions, TWorker>;

    // provided in MonacoEditor.tsx
    function setEditor(editor: monaco.editor.ICodeEditor): void;
    function getLanguage<TWorker extends any>(...uri: monaco.Uri[]): Promise<TWorker>;
    function get<TWorker extends any>(label: string, ...uri: monaco.Uri[]): Promise<TWorker>;

    function updateConfig<TOptions>(
      label: string,
      config?: Omit<
        monaco.worker.IWorkerConfig<TOptions>,
        'languageId' | 'label'
      >
    ): void;

    function updateOptions<TOptions>(label: string, options?: TOptions): void;
  }
}

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

class WorkerConfig<TOptions>
  implements monaco.IDisposable, monaco.worker.IWorkerConfig<TOptions> {
  private _onDidChange = new monaco.Emitter<
    monaco.worker.IWorkerConfig<TOptions>
  >();
  private _config: monaco.worker.IWorkerConfig<TOptions>;
  constructor(config: monaco.worker.IWorkerConfig<TOptions>) {
    this._config = config;
  }
  // @ts-ignore

  get onDidChange(): monaco.IEvent<monaco.worker.IWorkerConfig<TOptions>> {
    return this._onDidChange.event;
  }

  dispose(): void {
    this._onDidChange.dispose();
  }

  get config(): monaco.worker.IWorkerConfig<TOptions> {
    return this._config;
  }

  get languageId() {
    return this._config.languageId;
  }

  get label() {
    return this._config.label;
  }

  get providers() {
    return this._config.providers;
  }

  get options() {
    return this._config.options;
  }

  setConfig(config: monaco.worker.IWorkerConfig<TOptions>) {
    this._config = Object.assign({}, this._config, config);
    this._onDidChange.fire(this._config);
  }

  setOptions(options: TOptions) {
    this._config.options = Object.assign({}, this._config.options, options);
    this._onDidChange.fire(this._config);
  }
}

export class WorkerClient<TOptions, TWorker> implements monaco.IDisposable {
  private _config: WorkerConfig<TOptions>;
  private _idleCheckInterval: number;
  private _lastUsedTime: number;
  private _worker: monaco.editor.MonacoWebWorker<TWorker> | null;
  private _client: Promise<TWorker> | null;
  private _providerDisposables: monaco.IDisposable[];
  private _disposables: monaco.IDisposable[];

  constructor(config: monaco.worker.IWorkerConfig<TOptions>) {
    this._config = new WorkerConfig(config);
    this._idleCheckInterval = window.setInterval(
      () => this._checkIfIdle(),
      30 * 1000
    );
    this._lastUsedTime = 0;
    this._worker = null;
    this._client = null;
    const stopWorkerConfigListener = this._config.onDidChange(() =>
      this._stopWorker()
    );
    const registerProviderListener = this._config.onDidChange(() =>
      this._registerProviders()
    );
    this._providerDisposables = [];
    this._disposables = [
      stopWorkerConfigListener,
      registerProviderListener,
      this._config,
    ];
    this._registerProviders();
  }

  private _stopWorker(): void {
    if (this._worker) {
      this._worker.dispose();
      this._worker = null;
    }
    this._client = null;
  }

  dispose(): void {
    clearInterval(this._idleCheckInterval);
    disposeAll(this._disposables);
    this._stopWorker();
  }

  _registerProviders() {
    if (this.config.languageId) {
      disposeAll(this._providerDisposables);
      this._providerDisposables = setupWorkerProviders(
        this.config.languageId,
        this.config.providers,
        this,
      );
      this._disposables.push(asDisposable(this._providerDisposables));
    }
  }

  get config(): WorkerConfig<TOptions> {
    return this._config;
  }

  get onConfigDidChange(): monaco.IEvent<
    monaco.worker.IWorkerConfig<TOptions>
  > {
    return this._config.onDidChange;
  }

  private _checkIfIdle(): void {
    if (!this._worker) {
      return;
    }
    let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
    if (timePassedSinceLastUsed > STOP_WHEN_IDLE_FOR) {
      this._stopWorker();
    }
  }

  private _getClient(): Promise<TWorker> {
    this._lastUsedTime = Date.now();

    if (!this._client) {
      this._worker = monaco.editor.createWebWorker<TWorker>({
        moduleId: `vs/language/${this.config.languageId}`,
        label: this.config.label,
        createData: this.config.options,
      });
      this._client = <Promise<TWorker>>(<any>this._worker.getProxy());
    }

    return this._client;
  }

  async getSyncedWorker(...resources: monaco.Uri[]): Promise<TWorker> {
    const client = await this._getClient();
    await this._worker?.withSyncedResources(resources);
    return client;
  }
}

function asDisposable(disposables: monaco.IDisposable[]): monaco.IDisposable {
  return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: monaco.IDisposable[]) {
  while (disposables.length) {
    disposables.pop()?.dispose();
  }
}

const javascriptClient: WorkerClient<
  monaco.languages.typescript.LanguageServiceDefaults,
  monaco.languages.typescript.TypeScriptWorker
> = {
  getSyncedWorker: async (
    ...resources: monaco.Uri[]
  ): Promise<monaco.languages.typescript.TypeScriptWorker> => {
    const getWorker = await monaco.languages.typescript.getJavaScriptWorker();
    return await getWorker(...resources);
  },
  // @ts-ignore
  config: monaco.languages.typescript.javascriptDefaults,
};

const typescriptClient: WorkerClient<
  monaco.languages.typescript.LanguageServiceDefaults,
  monaco.languages.typescript.TypeScriptWorker
> = {
  getSyncedWorker: async (
    ...resources: monaco.Uri[]
  ): Promise<monaco.languages.typescript.TypeScriptWorker> => {
    const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
    return await getWorker(...resources);
  },
  // @ts-ignore
  config: monaco.languages.typescript.typescriptDefaults,
};

class MonacoWorkerApi {
  workerClients: { [key: string]: WorkerClient<any, any> } = {
    typescript: typescriptClient,
    javascript: javascriptClient,
  };

  _editor?: monaco.editor.ICodeEditor;
  _registerWorker<TOptions>({
    languageId,
    label = languageId,
    options,
    providers = defaultProviderConfig,
    onRegister,
  }: monaco.worker.IWorkerRegistrationOptions<TOptions>) {
    const client = new WorkerClient({
      languageId,
      label,
      options,
      providers,
    });
    this.workerClients[label ?? ''] = client;
    if (onRegister) {
      onRegister(client, monaco);
    }
    return client;
  }

  register<TOptions>(config: monaco.worker.IWorkerRegistrationOptions<TOptions>) {
    if (config.languageId) {
      return monaco.languages.onLanguage(config.languageId, () => {
        return this._registerWorker(config);
      });
    } else {
      return this._registerWorker(config);
    }
  }

  getClient<TOptions, TWorker>(label: string) {
    if (!this.workerClients[label]) {
      throw new Error(`Worker ${label} not registered!`);
    }

    return this.workerClients[label] as WorkerClient<TOptions, TWorker>;
  }

  setEditor(editor: monaco.editor.ICodeEditor) {
    this._editor = editor;
  }

  async getLanguage<TWorker>(...uri: monaco.Uri[]) {
    let language;
    if (uri.length === 0 && this._editor) {
      const model = this._editor?.getModel();
      if (model) {
        language = model.getModeId();
        uri.push(model.uri);
      }
    } else {
      const model = monaco.editor.getModel(uri[0]);
      if (model) {
        language = model.getModeId();
      }
    }
    if (!language) {
      return null;
    }

    return await this.get<TWorker>(language, ...uri);
  }

  async get<TWorker>(label: string, ...uri: monaco.Uri[]) {
    if (uri.length === 0 && this._editor) {
      const editorUri =this._editor.getModel()?.uri;
      editorUri && uri.push(editorUri);
    }
    
    return this.getClient<any, TWorker>(label).getSyncedWorker(...uri);
  }

  setConfig<TOptions>(label: string, config: monaco.worker.IWorkerConfig<TOptions>) {
    this.getClient<TOptions, any>(label).config.setConfig(config);
  }

  updateOptions<TOptions>(label: string, options: TOptions) {
    this.getClient<TOptions, any>(label).config.setOptions(options);
  }
}

// @ts-ignore
monaco.worker = new MonacoWorkerApi();
