/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as monaco from 'monaco-editor';

// import { LanguageServiceDefaultsImpl } from './monaco.contribution';
// import { CSSWorker } from './cssWorker';

const STOP_WHEN_IDLE_FOR = 2 * 60 * 1000; // 2min

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

const workerClients: { [key: string]: monaco.languages.IGetWorker<any> } = {
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
    try {
      return await worker._provide(
        provider,
        resource.toString(),
        ...args.slice(0, args.length - 1)
      );
    } catch (e) {
      return null;
    }
  };
};

const getSignatureHelpProvider = getWorker => {
  return async (model, position, token, context) => {
    let resource = model.uri;
    const worker = await getWorker(resource);
    try {
      return await worker._provide(
        'signatureHelp',
        resource.toString(),
        position,
        context
      );
    } catch (e) {
      return null;
    }
  };
};

const getResolver = (getWorker, resolver) => {
  return async (model, ...args) => {
    let resource = model.uri;
    const worker = await getWorker(resource);
    try {
      return await worker._resolve(
        resolver,
        resource.toString(),
        ...args.slice(0, args.length - 1)
      );
    } catch (e) {
      return null;
    }
  };
};

export const defaultProviders = {
  reference: true,
  rename: true,
  signatureHelp: true,
  hover: true,
  documentSymbol: true,
  documentHighlight: true,
  definition: true,
  implementation: true,
  typeDefinition: true,
  codeLens: true,
  codeAction: true,
  documentFormattingEdit: true,
  documentRangeFormattingEdit: true,
  onTypeFormattingEdit: true,
  link: true,
  completionItem: true,
  color: true,
  foldingRange: true,
  declaration: true,
  selectionRange: true,
  documentSemanticTokens: true,
  documentRangeSemanticTokens: true,
};

export function setupWorker<T>(
  config: monaco.languages.ILangWorkerConfig
): monaco.languages.IGetWorker<T> {
  const {
    languageId,
    options,
    providers: providersConfig = defaultProviders,
    onRegister,
  } = config;
  const client = new WorkerManager<T>(config);

  const getWorker: monaco.languages.IGetWorker<any> = async (...uris) => {
    return await client.getSyncedWorker(...uris);
  };

  workerClients[config.label] = getWorker;

  if (onRegister) {
    onRegister(getWorker);
  }

  if (!providersConfig) {
    return;
  }

  let providers =
    typeof providersConfig === 'boolean' && providersConfig
      ? defaultProviders
      : (providersConfig as monaco.languages.ILangWorkerProviders);

  if (providers.reference) {
    monaco.languages.registerReferenceProvider(languageId, {
      provideReferences: getProvider(getWorker, 'references'),
    });
  }
  if (providers.rename) {
    monaco.languages.registerRenameProvider(languageId, {
      provideRenameEdits: getProvider(getWorker, 'renameEdits'),
      resolveRenameLocation: getResolver(getWorker, 'renameLocation'),
    });
  }
  if (providers.signatureHelp) {
    monaco.languages.registerSignatureHelpProvider(languageId, {
      provideSignatureHelp: getSignatureHelpProvider(getWorker),
    });
  }
  if (providers.hover) {
    monaco.languages.registerHoverProvider(languageId, {
      provideHover: getProvider(getWorker, 'hover'),
    });
  }
  if (providers.documentSymbol) {
    monaco.languages.registerDocumentSymbolProvider(languageId, {
      provideDocumentSymbols: getProvider(getWorker, 'documentSymbols'),
    });
  }
  if (providers.documentHighlight) {
    monaco.languages.registerDocumentHighlightProvider(languageId, {
      provideDocumentHighlights: getProvider(getWorker, 'documentHighlights'),
    });
  }
  if (providers.definition) {
    monaco.languages.registerDefinitionProvider(languageId, {
      provideDefinition: getProvider(getWorker, 'definition'),
    });
  }
  if (providers.implementation) {
    monaco.languages.registerImplementationProvider(languageId, {
      provideImplementation: getProvider(getWorker, 'implementation'),
    });
  }
  if (providers.typeDefinition) {
    monaco.languages.registerTypeDefinitionProvider(languageId, {
      provideTypeDefinition: getProvider(getWorker, 'typeDefinition'),
    });
  }
  if (providers.codeLens) {
    monaco.languages.registerCodeLensProvider(languageId, {
      provideCodeLenses: getProvider(getWorker, 'codeLenses'),
      resolveCodeLens: getResolver(getWorker, 'codeLens'),
    });
  }
  if (providers.codeAction) {
    monaco.languages.registerCodeActionProvider(languageId, {
      provideCodeActions: getProvider(getWorker, 'codeActions'),
    });
  }
  if (providers.documentFormattingEdit) {
    monaco.languages.registerDocumentFormattingEditProvider(languageId, {
      provideDocumentFormattingEdits: getProvider(
        getWorker,
        'documentFormattingEdits'
      ),
    });
  }
  if (providers.documentRangeFormattingEdit) {
    monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, {
      provideDocumentRangeFormattingEdits: getProvider(
        getWorker,
        'documentRangeFormattingEdits'
      ),
    });
  }
  // if (providers.onTypeFormattingEdit) {
  //     monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
  // provideOnTypeFormattingEdits: getProvider(getWorker, 'onTypeFormattingEdits')
  // });
  // }
  if (providers.link) {
    monaco.languages.registerLinkProvider(languageId, {
      provideLinks: getProvider(getWorker, 'links'),
    });
  }
  if (providers.completionItem) {
    monaco.languages.registerCompletionItemProvider(languageId, {
      provideCompletionItems: getProvider(getWorker, 'completionItems'),
      resolveCompletionItem: getResolver(getWorker, 'completionItem'),
    });
  }
  if (providers.color) {
    monaco.languages.registerColorProvider(languageId, {
      provideDocumentColors: getProvider(getWorker, 'documentColors'),
      provideColorPresentations: getProvider(getWorker, 'colorPresentations'),
    });
  }
  if (providers.foldingRange) {
    monaco.languages.registerFoldingRangeProvider(languageId, {
      provideFoldingRanges: getProvider(getWorker, 'foldingRanges'),
    });
  }
  if (providers.declaration) {
    monaco.languages.registerDeclarationProvider(languageId, {
      provideDeclaration: getProvider(getWorker, 'declaration'),
    });
  }
  if (providers.selectionRange) {
    monaco.languages.registerSelectionRangeProvider(languageId, {
      provideSelectionRanges: getProvider(getWorker, 'selectionRanges'),
    });
  }
  // if (providers.documentSemanticTokens) {
  //     monaco.languages.registerDocumentSemanticTokensProvider(languageId, {
  // provideDocumentSemanticTokens: getProvider(getWorker, 'documentSemanticTokens')
  // });
  // }
  //
  // if (providers.documentRangeSemanticTokens) {
  //     monaco.languages.registerDocumentRangeSemanticTokensProvider(languageId, {
  // provideDocumentRangeSemanticTokens: getProvider(getWorker, 'documentRangeSemanticTokens')
  // });
  // }

  return getWorker;
}
