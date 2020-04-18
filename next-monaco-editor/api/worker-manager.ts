/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as monaco from 'monaco-editor';
import { setupWorkerProviders } from './providers';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerConfig<T> {
  // @ts-ignore
  private _onDidChange = new monaco.Emitter<T>();
  private _config: T;
  constructor(config: T) {
    this._config = config;
  }
  // @ts-ignore

  get onDidChange(): monaco.IEvent<T> {
    return this._onDidChange.event;
  }

  get config(): T | undefined{
    return this._config;
  }

  setConfig(config: T) {
    this._config = Object.assign({}, this._config, config);
    this._onDidChange.fire(this._config);
  }

}

export class WorkerManager<T> {
  private _config: WorkerConfig<monaco.worker.ILangWorkerConfig>;
  // private _config: LanguageServiceDefaultsImpl;
  private _idleCheckInterval: number;
  private _lastUsedTime: number;
  private _configChangeListener: monaco.IDisposable;

  private _worker: monaco.editor.MonacoWebWorker<T> | null;
  private _client: Promise<T> | null;

  constructor(config: WorkerConfig<monaco.worker.ILangWorkerConfig>) {
    this._config = config;
    this._idleCheckInterval = window.setInterval(
      () => this._checkIfIdle(),
      30 * 1000
    );
    this._lastUsedTime = 0;
    this._worker = null;
    this._client = null;
    this._configChangeListener = this._config.onDidChange(() => this._stopWorker());
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
    this._configChangeListener.dispose();
    this._stopWorker();
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

  private _getClient(): Promise<T> {
    this._lastUsedTime = Date.now();

    if (!this._client) {
      this._worker = monaco.editor.createWebWorker<T>({
        // module that exports the create() method and returns a `CSSWorker` instance
        moduleId: `vs/language/${this._config.config?.languageId}`,

        label: this._config.config?.label,

        createData: this._config.config?.options,
      });

      this._client = <Promise<T>>(<any>this._worker.getProxy());
    }

    return this._client;
  }

  async getSyncedWorker(...resources: monaco.Uri[]): Promise<T> {
    const client = await this._getClient();
    await this._worker?.withSyncedResources(resources);
    return client;
  }
}

const workerClients: { [key: string]: monaco.worker.IWorkerAccessor<any> } = {
  javascript: monaco.languages.typescript.getJavaScriptWorker as any,
  typescript: monaco.languages.typescript.getTypeScriptWorker as any,
};

export async function getWorkerClient<T>(
  label: string
): Promise<(...uris: monaco.Uri[]) => Promise<T>> {
  if (!workerClients[label]) {
    throw new Error(`Worker ${label} not registered!`);
  }

  if (label === 'javascript' || label === 'typescript') {
    return await workerClients[label]();
  }

  return workerClients[label];
}

export function getWorkerConfig<T>(
  label: string
): WorkerConfig<T> | null {
  if (!workerClients[label]) {
    throw new Error(`Worker ${label} not registered!`);
  }

  if (label === 'javascript' || label === 'typescript') {
    return null;
  }

  // @ts-ignore
  return workerClients[label].config;
}

export function setupWorker<T>(
  config: monaco.worker.ILangWorkerConfig
): monaco.IDisposable {
  const disposables: monaco.IDisposable[] = [];
  let providerDisposables: monaco.IDisposable[] = [];

  const workerConfig = new WorkerConfig(config);
  const {
    languageId,
    providers,
    onRegister,
  } = config;
  
  const client = new WorkerManager<T>(workerConfig);
  disposables.push(client);

  const getWorker: monaco.worker.IWorkerAccessor<any> = async (...uris) => {
    return await client.getSyncedWorker(...uris);
  };

  workerConfig.onDidChange(
    // @ts-ignore
    (newConfig: any) => {
        registerProviders();
    },
  );

  // @ts-ignore
  getWorker.config = workerConfig;
  workerClients[config.label ?? config.languageId as any] = getWorker;
  
  function registerProviders() {
    if (languageId) {
      disposeAll(providerDisposables);
      providerDisposables = setupWorkerProviders({ providers, languageId, getWorker})
      disposables.push(asDisposable(providerDisposables));
    }
  }

  registerProviders();

  if (onRegister) {
    onRegister(getWorker, monaco);
  }

  return asDisposable(disposables);
}

function asDisposable(disposables: monaco.IDisposable[]): monaco.IDisposable {
  return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: monaco.IDisposable[]) {
  while (disposables.length) {
    disposables.pop()?.dispose();
  }
}
