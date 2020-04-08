import * as monaco from 'monaco-editor';

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
  documentSemanticTokens: true,
  documentRangeSemanticTokens: true,
};

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

interface IProvidersConfig {
  getWorker: monaco.languages.IGetWorker<any>
  languageId: string;
  providers?: monaco.languages.ILangWorkerProviders | boolean;
}

export const setupWorkerProviders = ({ providers = defaultProviderConfig, languageId, getWorker }: IProvidersConfig) => {
  if (!providers) {
    return;
  }
  
  providers =
    typeof providers === 'boolean' && providers
      ? defaultProviderConfig
      : (providers as monaco.languages.ILangWorkerProviders);

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
}