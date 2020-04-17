/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as monaco from 'monaco-editor';
import { setupWorkerProviders } from './providers';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

export class WorkerManager<T> {
  private _config: monaco.worker.ILangWorkerConfig;
  // private _config: LanguageServiceDefaultsImpl;
  private _idleCheckInterval: number;
  private _lastUsedTime: number;
  // private _configChangeListener: monaco.IDisposable;

  private _worker: monaco.editor.MonacoWebWorker<T> | null;
  private _client: Promise<T> | null;

  constructor(config: monaco.worker.ILangWorkerConfig) {
    this._config = config;
    this._idleCheckInterval = window.setInterval(
      () => this._checkIfIdle(),
      30 * 1000
    );
    this._lastUsedTime = 0;
    this._worker = null;
    this._client = null;
    // this._configChangeListener = this._config.onDidChange(() => this._stopWorker());
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
    // this._configChangeListener.dispose();
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
        moduleId: `vs/language/${this._config.languageId}`,

        label: this._config.label,

        createData: this._config.options,
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
  javascript: monaco.languages.typescript.getJavaScriptWorker,
  typescript: monaco.languages.typescript.getTypeScriptWorker,
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

export function setupWorker<T>(
  config: monaco.worker.ILangWorkerConfig
): monaco.worker.IWorkerAccessor<T> {
  const {
    languageId,
    providers,
    onRegister,
  } = config;
  
  const client = new WorkerManager<T>(config);

  const getWorker: monaco.worker.IWorkerAccessor<any> = async (...uris) => {
    return await client.getSyncedWorker(...uris);
  };

  workerClients[config.label ?? config.languageId as any] = getWorker;
  
  if (languageId) {
    setupWorkerProviders({ providers, languageId, getWorker})
  }

  if (onRegister) {
    onRegister(getWorker, monaco);
  }

  return getWorker;
}