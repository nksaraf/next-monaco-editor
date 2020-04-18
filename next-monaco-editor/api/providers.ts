import * as monaco from 'monaco-editor';
import { WorkerConfig } from './worker-manager';

export const defaultProviderConfig = {
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
  diagnostics: true,
  documentSemanticTokens: true,
  documentRangeSemanticTokens: true,
};

export const getProvider = (
  getWorker: monaco.worker.IWorkerAccessor<any>,
  provider: string
) => {
  return async (model: monaco.editor.IModel, ...args: any[]) => {
    let resource = model.uri;
    try {
      const worker = await getWorker(resource);
      return await worker.provide(
        provider,
        resource.toString(),
        ...args.slice(0, args.length - 1)
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  };
};

const getSignatureHelpProvider = (
  getWorker: monaco.worker.IWorkerAccessor<any>
) => {
  return async (
    model: monaco.editor.ITextModel,
    position: monaco.IPosition,
    token: monaco.CancellationToken,
    context: monaco.languages.SignatureHelpContext
  ) => {
    let resource = model.uri;
    try {
      const worker = await getWorker(resource);
      return await worker.provide(
        'signatureHelp',
        resource.toString(),
        position,
        context
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  };
};

export const getResolver = (
  getWorker: monaco.worker.IWorkerAccessor<any>,
  resolver: string
) => {
  return async (model: monaco.editor.IModel, ...args: any[]) => {
    let resource = model.uri;
    try {
      const worker = await getWorker(resource);
      return await worker.resolve(
        resolver,
        resource.toString(),
        ...args.slice(0, args.length - 1)
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  };
};

export class DiagnosticsAdapter {
  private _disposables: monaco.IDisposable[] = [];
  private _listener: { [uri: string]: monaco.IDisposable } = Object.create(
    null
  );
  private _editor?: monaco.editor.ICodeEditor;

  isCurrentModel(model: monaco.editor.ITextModel) {
    if (this._editor) {
      const currentModel = this._editor.getModel();
      if (
        currentModel &&
        currentModel.uri.toString() === model.uri.toString()
      ) {
        return true;
      }
    }

    return false;
  }
  constructor(
    private _config: WorkerConfig<any>,
    private _worker: monaco.worker.IWorkerAccessor<any>
  ) {
    this._worker = _worker;

    this._disposables.push(
      monaco.editor.onDidCreateEditor((editor) => {
        this._editor = editor;
      })
    );
    const onModelAdd = (model: monaco.editor.IModel): void => {
      const modeId = model.getModeId();
      if (modeId !== _config.config.languageId) {
        return;
      }

      let handle: number;
      this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
        clearTimeout(handle);
        // @ts-ignore
        handle = setTimeout(() => {
          if (this.isCurrentModel(model)) {
            this._doValidate(model.uri, modeId);
          }
        }, 500);
      });

      // if (this.isCurrentModel(model)) {
      //   this._doValidate(model.uri, modeId);
      // }
    };

    const onModelRemoved = (model: monaco.editor.IModel): void => {
      monaco.editor.setModelMarkers(model, _config.config.languageId, []);
      const uriStr = model.uri.toString();
      const listener = this._listener[uriStr];
      if (listener) {
        listener.dispose();
        delete this._listener[uriStr];
      }
    };

    this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
    this._disposables.push(
      monaco.editor.onWillDisposeModel((model) => {
        onModelRemoved(model);
      })
    );
    this._disposables.push(
      monaco.editor.onDidChangeModelLanguage((event) => {
        onModelRemoved(event.model);
        onModelAdd(event.model);
      })
    );

    this._disposables.push(
      _config.onDidChange((_: any) => {
        monaco.editor.getModels().forEach((model) => {
          if (model.getModeId() === _config.config.languageId) {
            onModelRemoved(model);
            onModelAdd(model);
          }
        });
      })
    );

    this._disposables.push({
      dispose: () => {
        for (const key in this._listener) {
          this._listener[key].dispose();
        }
      },
    });

    // monaco.editor.getModels().forEach(onModelAdd);
  }

  public dispose(): void {
    this._disposables.forEach((d) => d && d.dispose());
    this._disposables = [];
  }

  private async _doValidate(resource: monaco.Uri, languageId: string) {
    try {
      const worker = await this._worker(resource);
      const diagnostics = await worker.doValidation(resource.toString());
      monaco.editor.setModelMarkers(
        monaco.editor.getModel(resource) as monaco.editor.ITextModel,
        languageId,
        diagnostics
      );
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

export const setupWorkerProviders = ({
  providers = defaultProviderConfig,
  languageId,
  getWorker,
}: monaco.worker.IProvidersConfig): monaco.IDisposable[] => {
  const disposables: monaco.IDisposable[] = [];
  if (!providers) {
    return [];
  }

  providers =
    typeof providers === 'boolean' && providers
      ? defaultProviderConfig
      : (providers as monaco.worker.ILangWorkerProviders);

  if (providers.diagnostics) {
    disposables.push(new DiagnosticsAdapter(getWorker.config, getWorker));
  }

  if (providers.reference) {
    disposables.push(
      monaco.languages.registerReferenceProvider(languageId, {
        provideReferences: getProvider(getWorker, 'references'),
      })
    );
  }
  if (providers.rename) {
    disposables.push(
      monaco.languages.registerRenameProvider(languageId, {
        provideRenameEdits: getProvider(getWorker, 'renameEdits'),
        resolveRenameLocation: getResolver(getWorker, 'renameLocation'),
      })
    );
  }
  if (providers.signatureHelp) {
    disposables.push(
      monaco.languages.registerSignatureHelpProvider(languageId, {
        provideSignatureHelp: getSignatureHelpProvider(getWorker),
      })
    );
  }
  if (providers.hover) {
    disposables.push(
      monaco.languages.registerHoverProvider(languageId, {
        provideHover: getProvider(getWorker, 'hover'),
      })
    );
  }
  if (providers.documentSymbol) {
    disposables.push(
      monaco.languages.registerDocumentSymbolProvider(languageId, {
        provideDocumentSymbols: getProvider(getWorker, 'documentSymbols'),
      })
    );
  }
  if (providers.documentHighlight) {
    disposables.push(
      monaco.languages.registerDocumentHighlightProvider(languageId, {
        provideDocumentHighlights: getProvider(getWorker, 'documentHighlights'),
      })
    );
  }
  if (providers.definition) {
    disposables.push(
      monaco.languages.registerDefinitionProvider(languageId, {
        provideDefinition: getProvider(getWorker, 'definition'),
      })
    );
  }
  if (providers.implementation) {
    disposables.push(
      monaco.languages.registerImplementationProvider(languageId, {
        provideImplementation: getProvider(getWorker, 'implementation'),
      })
    );
  }
  if (providers.typeDefinition) {
    disposables.push(
      monaco.languages.registerTypeDefinitionProvider(languageId, {
        provideTypeDefinition: getProvider(getWorker, 'typeDefinition'),
      })
    );
  }
  if (providers.codeLens) {
    disposables.push(
      monaco.languages.registerCodeLensProvider(languageId, {
        provideCodeLenses: getProvider(getWorker, 'codeLenses'),
        resolveCodeLens: getResolver(getWorker, 'codeLens'),
      })
    );
  }
  if (providers.codeAction) {
    disposables.push(
      monaco.languages.registerCodeActionProvider(languageId, {
        provideCodeActions: getProvider(getWorker, 'codeActions'),
      })
    );
  }
  if (providers.documentFormattingEdit) {
    disposables.push(
      monaco.languages.registerDocumentFormattingEditProvider(languageId, {
        provideDocumentFormattingEdits: getProvider(
          getWorker,
          'documentFormattingEdits'
        ),
      })
    );
  }
  if (providers.documentRangeFormattingEdit) {
    disposables.push(
      monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, {
        provideDocumentRangeFormattingEdits: getProvider(
          getWorker,
          'documentRangeFormattingEdits'
        ),
      })
    );
  }
  // if (providers.onTypeFormattingEdit) {
  //   disposables.push(
  //     monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
  //       provideOnTypeFormattingEdits: getProvider(
  //         getWorker,
  //         'onTypeFormattingEdits'
  //       ),
  //     })
  //   );
  // }
  if (providers.link) {
    disposables.push(
      monaco.languages.registerLinkProvider(languageId, {
        provideLinks: getProvider(getWorker, 'links'),
      })
    );
  }
  if (providers.completionItem) {
    disposables.push(
      monaco.languages.registerCompletionItemProvider(languageId, {
        triggerCharacters: providers.completionTriggerCharacters || [],
        provideCompletionItems: getProvider(getWorker, 'completionItems'),
        resolveCompletionItem: getResolver(getWorker, 'completionItem'),
      })
    );
  }
  if (providers.color) {
    disposables.push(
      monaco.languages.registerColorProvider(languageId, {
        provideDocumentColors: getProvider(getWorker, 'documentColors'),
        provideColorPresentations: getProvider(getWorker, 'colorPresentations'),
      })
    );
  }
  if (providers.foldingRange) {
    disposables.push(
      monaco.languages.registerFoldingRangeProvider(languageId, {
        provideFoldingRanges: getProvider(getWorker, 'foldingRanges'),
      })
    );
  }
  if (providers.declaration) {
    disposables.push(
      monaco.languages.registerDeclarationProvider(languageId, {
        provideDeclaration: getProvider(getWorker, 'declaration'),
      })
    );
  }
  if (providers.selectionRange) {
    disposables.push(
      monaco.languages.registerSelectionRangeProvider(languageId, {
        provideSelectionRanges: getProvider(getWorker, 'selectionRanges'),
      })
    );
  }

  return disposables;

  // if (providers.onTypeFormattingEdit) {
  //     monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
  // provideOnTypeFormattingEdits: getProvider(getWorker, 'onTypeFormattingEdits')
  // });
  // }
};
