/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as monaco from 'monaco-editor';

// import { LanguageServiceDefaultsImpl } from './monaco.contribution';
// import { CSSWorker } from './cssWorker';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

interface GetWorker<T> {
  (...uris: monaco.Uri[]): Promise<T>;
}

export class WorkerManager<T> {
  private _config: monaco.languages.ILangWorkerConfig;
  // private _config: LanguageServiceDefaultsImpl;
  private _idleCheckInterval: number;
  private _lastUsedTime: number;
  // private _configChangeListener: monaco.IDisposable;

  private _worker: monaco.editor.MonacoWebWorker<T>;
  private _client: Promise<T>;

  constructor(config: monaco.languages.ILangWorkerConfig) {
    this._config = config;
    this._worker = null;
    this._idleCheckInterval = window.setInterval(
      () => this._checkIfIdle(),
      30 * 1000
    );
    this._lastUsedTime = 0;
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
    await this._worker.withSyncedResources(resources);
    return client;
  }
}

// import { CSSWorker } from './cssWorker';
// import { LanguageServiceDefaultsImpl } from './monaco.contribution';
// import * as languageFeatures from './languageFeatures';

const workerClients: { [key: string]: GetWorker<any> } = {
  javascript: monaco.languages.typescript.getJavaScriptWorker,
  typescript: monaco.languages.typescript.getTypeScriptWorker,
};

export async function getWorkerClient<T>(
  label: string
): Promise<(...uris: monaco.Uri[]) => Promise<T>> {
  console.log(label);
  if (!workerClients[label]) {
    throw new Error(`Worker ${label} not registered!`);
  }

  if (label === 'javascript' || label === 'typescript') {
    return await workerClients[label]();
  }

  return workerClients[label];
}

export function setupWorker<T>(
  config: monaco.languages.ILangWorkerConfig
): GetWorker<T> {
  // const disposables: monaco.IDisposable[] = [];
  // const providers: monaco.IDisposable[] = [];
  const { languageId, options } = config;
  const client = new WorkerManager<T>(config);
  // disposables.push(client);

  const getWorker: GetWorker<any> = async (...uris) => {
    return await client.getSyncedWorker(...uris);
  };

  workerClients[config.label] = getWorker;
  monaco.languages.registerHoverProvider(languageId, {
    provideHover: async (
      model: monaco.editor.IReadOnlyModel,
      position: monaco.Position,
      token: monaco.CancellationToken
    ): Promise<monaco.languages.Hover> => {
      let resource = model.uri;
      const worker = await getWorker(resource);
      try  {
        console.log(worker);
        console.log(await worker.provideHover(resource.toString(), position));
        return await worker.provideHover(resource.toString(), position);
      } catch(e) {
        return null;
      }
    },
  });

  return getWorker;
}

// disposeAll(providers);

// if (modeConfiguration.completionItems) {
//   providers.push(
//     monaco.languages.registerCompletionItemProvider(
//       languageId,
//       new languageFeatures.CompletionAdapter(worker)
//     )
//   );
// }
// if (modeConfiguration.hovers) {
//   providers.push(
//     monaco.languages.registerHoverProvider(
//       languageId,
//       new languageFeatures.HoverAdapter(worker)
//     )
//   );
// }
// if (modeConfiguration.documentHighlights) {
//   providers.push(
//     monaco.languages.registerDocumentHighlightProvider(
//       languageId,
//       new languageFeatures.DocumentHighlightAdapter(worker)
//     )
//   );
// }
// if (modeConfiguration.definitions) {
//   providers.push(
//     monaco.languages.registerDefinitionProvider(
//       languageId,
//       new languageFeatures.DefinitionAdapter(worker)
//     )
//   );
// }
// if (modeConfiguration.references) {
//   providers.push(
//     monaco.languages.registerReferenceProvider(
//       languageId,
//       new languageFeatures.ReferenceAdapter(worker)
//     )
//   );
// }
// if (modeConfiguration.documentSymbols) {
//   providers.push(
//     monaco.languages.registerDocumentSymbolProvider(
//       languageId,
//       new languageFeatures.DocumentSymbolAdapter(worker)
//     )
//   );
// }
// if (modeConfiguration.rename) {
//   providers.push(
//     monaco.languages.registerRenameProvider(
//       languageId,
//       new languageFeatures.RenameAdapter(worker)
//     )
//   );
// }
// if (modeConfiguration.colors) {
//   providers.push(
//     monaco.languages.registerColorProvider(
//       languageId,
//       new languageFeatures.DocumentColorAdapter(worker)
//     )
//   );
// }
// if (modeConfiguration.foldingRanges) {
//   providers.push(
//     monaco.languages.registerFoldingRangeProvider(
//       languageId,
//       new languageFeatures.FoldingRangeAdapter(worker)
//     )
//   );
// }
// if (modeConfiguration.diagnostics) {
//   providers.push(
//     new languageFeatures.DiagnosticsAdapter(languageId, worker, defaults)
//   );
// }
// if (modeConfiguration.selectionRanges) {
//   providers.push(
//     monaco.languages.registerSelectionRangeProvider(
//       languageId,
//       new languageFeatures.SelectionRangeAdapter(worker)
//     )
//   );
// }

// disposables.push(asDisposable(providers));
// function asDisposable(disposables: monaco.IDisposable[]): monaco.IDisposable {
//   return { dispose: () => disposeAll(disposables) };
// }

// function disposeAll(disposables: monaco.IDisposable[]) {
//   while (disposables.length) {
//     disposables.pop().dispose();
//   }
// }
