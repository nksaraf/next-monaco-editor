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

const getProvider = (getWorker, provider) => {
  return async (model, ...args) => {
    let resource = model.uri;
    const worker = await getWorker(resource);
    try  {
      return await worker.provide(provider, resource.toString(), ...args.slice(0, args.length - 1));
    } catch(e) {
      return null;
    }
  }
}

const getResolver = (getWorker, resolver) => {
  return async (model, ...args) => {
    let resource = model.uri;
    const worker = await getWorker(resource);
    try  {
      return await worker.resolve(resolver, resource.toString(), ...args.slice(0, args.length - 1));
    } catch(e) {
      return null;
    }
  }
}

export function setupWorker<T>(
  config: monaco.languages.ILangWorkerConfig
): GetWorker<T> {
  const { languageId, options } = config;
  const client = new WorkerManager<T>(config);

  const getWorker: GetWorker<any> = async (...uris) => {
    return await client.getSyncedWorker(...uris);
  };

  workerClients[config.label] = getWorker;
  monaco.languages.registerReferenceProvider(languageId, {
    provideReferences: getProvider(getWorker, 'references')
  });
  
  monaco.languages.registerRenameProvider(languageId, {
    provideRenameEdits: getProvider(getWorker, 'renameEdits'),
  resolveRenameLocation: getResolver(getWorker, 'renameLocation')
  });
  
  monaco.languages.registerSignatureHelpProvider(languageId, {
    provideSignatureHelp: getProvider(getWorker, 'signatureHelp')
  });
  
  monaco.languages.registerHoverProvider(languageId, {
    provideHover: getProvider(getWorker, 'hover')
  });
  
  monaco.languages.registerDocumentSymbolProvider(languageId, {
    provideDocumentSymbols: getProvider(getWorker, 'documentSymbols')
  });
  
  monaco.languages.registerDocumentHighlightProvider(languageId, {
    provideDocumentHighlights: getProvider(getWorker, 'documentHighlights')
  });
  
  monaco.languages.registerDefinitionProvider(languageId, {
    provideDefinition: getProvider(getWorker, 'definition')
  });
  
  monaco.languages.registerImplementationProvider(languageId, {
    provideImplementation: getProvider(getWorker, 'implementation')
  });
  
  monaco.languages.registerTypeDefinitionProvider(languageId, {
    provideTypeDefinition: getProvider(getWorker, 'typeDefinition')
  });
  
  monaco.languages.registerCodeLensProvider(languageId, {
    provideCodeLenses: getProvider(getWorker, 'codeLenses'),
  resolveCodeLens: getResolver(getWorker, 'codeLens')
  });
  
  monaco.languages.registerCodeActionProvider(languageId, {
    provideCodeActions: getProvider(getWorker, 'codeActions')
  });
  
  monaco.languages.registerDocumentFormattingEditProvider(languageId, {
    provideDocumentFormattingEdits: getProvider(getWorker, 'documentFormattingEdits')
  });
  
  monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, {
    provideDocumentRangeFormattingEdits: getProvider(getWorker, 'documentRangeFormattingEdits')
  });
  
  // monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
  //   provideOnTypeFormattingEdits: getProvider(getWorker, 'onTypeFormattingEdits')
  // });
  
  monaco.languages.registerLinkProvider(languageId, {
    provideLinks: getProvider(getWorker, 'links')
  });
  
  monaco.languages.registerCompletionItemProvider(languageId, {
    provideCompletionItems: getProvider(getWorker, 'completionItems'),
  resolveCompletionItem: getResolver(getWorker, 'completionItem')
  });
  
  monaco.languages.registerColorProvider(languageId, {
    provideDocumentColors: getProvider(getWorker, 'documentColors'),
  provideColorPresentations: getProvider(getWorker, 'colorPresentations')
  });
  
  monaco.languages.registerFoldingRangeProvider(languageId, {
    provideFoldingRanges: getProvider(getWorker, 'foldingRanges')
  });
  
  monaco.languages.registerDeclarationProvider(languageId, {
    provideDeclaration: getProvider(getWorker, 'declaration')
  });
  
  monaco.languages.registerSelectionRangeProvider(languageId, {
    provideSelectionRanges: getProvider(getWorker, 'selectionRanges')
  });
  
  // monaco.languages.registerDocumentSemanticTokensProvider(languageId, {
  //   provideDocumentSemanticTokens: getProvider(getWorker, 'documentSemanticTokens')
  // });
  
  // monaco.languages.registerDocumentRangeSemanticTokensProvider(languageId, {
  //   provideDocumentRangeSemanticTokens: getProvider(getWorker, 'documentRangeSemanticTokens')
  // });
  

  return getWorker;
}