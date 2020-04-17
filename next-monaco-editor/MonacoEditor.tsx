import React from 'react';
import { noop, processDimensions, getNextWorkerPath } from './utils';
import monaco from './api';
import defaultThemes, { ThemeNames, themeNames } from './themes';
import './css/monaco.css';
import { QuickSelectAction } from './api/QuickSelectAction';

function setupCommandPaletteShortcuts(
  monacoApi: typeof monaco,
  editor: monaco.editor.IStandaloneCodeEditor
) {
  // for firefox support (wasn't able to intercept key)
  editor.addCommand(
    monacoApi.KeyMod.CtrlCmd | monacoApi.KeyMod.Shift | monacoApi.KeyCode.KEY_C,
    () => {
      editor.trigger('ctrl-shift-c', 'editor.action.quickCommand', null);
    }
  );

  editor.addCommand(
    monacoApi.KeyMod.CtrlCmd | monacoApi.KeyMod.Shift | monacoApi.KeyCode.KEY_P,
    () => {
      editor.trigger('ctrl-shift-p', 'editor.action.quickCommand', null);
    }
  );

  window.addEventListener('keydown', (event: any) => {
    if (event.metaKey && event.shiftKey && event.code === 'KeyP') {
      editor.trigger('ctrl-shift-p', 'editor.action.quickCommand', null);
      event.stopPropagation();
    }
  });
}

function setupThemes(
  monacoApi: typeof monaco,
  editor: monaco.editor.IStandaloneCodeEditor,
  themes: MonacoEditorProps['themes']
) {
  const allThemes = {
    ...defaultThemes,
    ...themes,
  };

  Object.keys(allThemes).forEach((themeName) => {
    monacoApi.editor.defineTheme(
      themeName,
      allThemes[themeName as keyof typeof allThemes]
    );
  });

  editor.addSelectAction({
    id: 'editor.action.selectTheme',
    label: 'Preferences: Color Theme',
    alias: 'Set Color Theme',
    isSupported: () => true,
    choices: () => Object.keys(themeNames),
    runChoice: (choice, mode, ctx, api) => {
      if (mode === 0) {
        api.editor.setTheme(themeNames[choice]);
      } else if (mode === 1) {
        api.editor.setTheme(themeNames[choice]);
        localStorage.setItem('theme', themeNames[choice]);
      }
    },
    runAction: function (editor: any, api: any) {
      const _this: any = this;
      const currentTheme = editor._themeService._theme.themeName;
      _this.show(editor);
      const controller = _this.getController(editor);
      const oldDestroy = controller.widget.quickOpenWidget.callbacks.onCancel;
      controller.widget.quickOpenWidget.callbacks.onCancel = function () {
        monaco.editor.setTheme(currentTheme);
        oldDestroy();
      };
      return Promise.resolve();
    },
  });
}

function setMonacoTheme(
  monacoApi: typeof monaco,
  theme: string | monaco.editor.IStandaloneThemeData | undefined
) {
  if (typeof theme === 'string') {
    monacoApi.editor.setTheme(theme);
    localStorage.setItem('theme', theme);
  } else if (typeof theme === 'object') {
    monacoApi.editor.defineTheme('custom', theme);
    monacoApi.editor.setTheme('custom');
    localStorage.setItem('theme', 'custom');
  }
}

function setupMonacoEnvironment(
  getWorkerUrl: (label: string) => string | undefined,
  getWorker: (label: string) => Worker | undefined
) {
  const getWorkerPath = (_moduleId: string, label: string) => {
    const url = getWorkerUrl(label);
    if (url) return url;
    if (label === 'editorWorkerService') {
      return getNextWorkerPath('editor');
    } else {
      if (label === 'typescript' || label === 'javascript') {
        return getNextWorkerPath('ts');
      }
      return getNextWorkerPath(label);
    }
  };
  // @ts-ignore
  window.MonacoEnvironment.getWorker = (_moduleId: string, label: string) => {
    const worker = getWorker(label);
    if (worker) return worker;
    return new Worker(getWorkerPath(_moduleId, label));
  };
}

function setupWorkerApi(monacoApi: typeof monaco, model: monaco.editor.IModel) {
  Object.assign(monacoApi.worker, {
    getDefault: async () => {
      if (!model) {
        return null;
      }
      const getWorker = await monacoApi.worker.getClient(
        (model as any).getLanguageIdentifier().language
      );
      const worker = await getWorker(model?.uri);
      return worker;
    },
    get: async (label: string) => {
      if (!model) {
        return null;
      }
      const getWorker = await monacoApi.worker.getClient(label);
      const worker = await getWorker(model?.uri);
      return worker;
    },
  });
}

export interface MonacoEditorProps {
  width?: string | number;
  height?: string | number;
  value?: string;
  defaultValue?: string;
  line?: number;
  style?: React.CSSProperties;
  path?: string;
  language?: string;
  theme?: ThemeNames | monaco.editor.IStandaloneThemeData;
  themes?: { [key: string]: monaco.editor.IStandaloneThemeData };
  options?: monaco.editor.IEditorOptions;
  overrideServices?:
    | monaco.editor.IEditorOverrideServices
    | ((
        monacoApi: typeof monaco,
        model: monaco.editor.ITextModel
      ) => monaco.editor.IEditorOverrideServices);
  className?: string;
  getWorker?: (label: string) => Worker | undefined;
  getWorkerUrl?: (label: string) => string | undefined;
  editorDidMount?: (
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoApi: typeof monaco
  ) => void;
  editorWillMount?: (
    monacoApi: typeof monaco
  ) => monaco.editor.IEditorOptions | void;
  onChange?: (
    newValue: string,
    editor: monaco.editor.IStandaloneCodeEditor,
    event: monaco.editor.IModelContentChangedEvent
  ) => void;
  plugins?: ((monacoApi: typeof monaco) => void)[];
}

// const editorStates = new Map();
// const useFS = ({ files }) => {};

type EditorRef = React.MutableRefObject<
  monaco.editor.IStandaloneCodeEditor | undefined
> & {
  useEffect: (
    func: (editor: monaco.editor.IStandaloneCodeEditor) => void,
    deps: any[]
  ) => void;
};

const useEditorRef = (): EditorRef => {
  const editorRef: any = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  editorRef.useEffect = React.useCallback(
    (
      func: (editor: monaco.editor.IStandaloneCodeEditor) => void,
      deps: any[]
    ) => {
      return React.useEffect(() => {
        if (editorRef.current) {
          func(editorRef.current);
        }
      }, [...deps, editorRef.current]);
    },
    []
  );
  return editorRef as EditorRef;
};

export const MonacoEditor = React.forwardRef<
  monaco.editor.IStandaloneCodeEditor,
  MonacoEditorProps
>(
  (
    {
      width = '100%',
      height = '100%',
      value,
      defaultValue = '',
      style = {},
      className = 'next-editor',
      line = 0,
      getWorkerUrl = noop as any,
      getWorker = noop as any,
      language = 'javascript',
      theme = 'vs-dark',
      path = 'model.js',
      plugins = [],
      themes = {},
      options = {},
      overrideServices = {},
      editorDidMount = noop,
      editorWillMount = noop,
      onChange = noop,
    }: MonacoEditorProps,
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
    const subscriptionRef = React.useRef<monaco.IDisposable>(null);

    React.useEffect(() => {
      if (!containerRef.current) {
        console.error('Assign container ref to something');
        return;
      }

      setupMonacoEnvironment(getWorkerUrl, getWorker);

      Object.assign(options, editorWillMount(monaco) || {});

      plugins.forEach((plugin) => {
        plugin(monaco);
      });

      const modelValue = value != null ? value : defaultValue;
      const modelPath = path.startsWith('/') ? path : `/${path}`;

      let model = monaco.editor
        .getModels()
        .find((model) => model.uri.path === modelPath);

      if (!model) {
        model = monaco.editor.createModel(
          modelValue,
          language,
          monaco.Uri.file(modelPath)
        );
      }

      editorRef.current = monaco.editor.create(
        containerRef.current,
        {
          model,
          language,
          automaticLayout: true,
          ...options,
        },
        typeof overrideServices === 'function'
          ? overrideServices(monaco, model)
          : overrideServices
      );

      editorRef.current.updateOptions({ tabSize: 2 });

      // console.log(monaco.)
      const { formatOnSave = true } = options;
      if (formatOnSave) {
        editorRef.current.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
          () => {
            editorRef.current?.trigger(
              'ctrl-s',
              'editor.action.formatDocument',
              null
            );
          }
        );
      }

      editorRef.current.addSelectAction = function (descriptor) {
        return (editorRef.current as any).addAction(
          new QuickSelectAction(descriptor, monaco)
        );
      };

      setupThemes(monaco, editorRef.current, themes);

      // CMD + Shift + P (like vscode), CMD + Shift + C
      setupCommandPaletteShortcuts(monaco, editorRef.current);
      setupWorkerApi(monaco, model);

      // editor ref
      if (ref) {
        if (typeof ref === 'function') {
          ref(editorRef.current);
        } else {
          (ref as any).current = editorRef.current;
        }
      }

      // After initializing monaco editor
      editorDidMount(editorRef.current, monaco);

      return () => {
        if (editorRef.current) {
          editorRef.current.dispose();
          const model = editorRef.current.getModel();
          if (model) {
            model.dispose();
          }
        }
      };
    }, []);

    React.useEffect(() => {
      if (editorRef.current) {
        // @ts-ignore
        subscriptionRef.current = editorRef.current.onDidChangeModelContent(
          (event) => {
            if (editorRef.current) {
              onChange(
                editorRef?.current?.getValue(),
                editorRef?.current,
                event
              );
            }
          }
        );
      }

      return () => {
        if (subscriptionRef.current) {
          subscriptionRef.current.dispose();
        }
      };
    }, [onChange, editorRef.current]);

    // React.useEffect(() => {
    //   if (editorRef.current) {
    //     editorRef.current.setScrollPosition({ scrollTop: line });
    //   }
    // }, [line, editorRef.current]);

    React.useEffect(() => {
      setMonacoTheme(monaco, theme);
    }, [theme]);

    React.useEffect(() => {
      if (editorRef.current) {
        editorRef.current.updateOptions(options);
      }
    }, [options, editorRef.current]);

    React.useEffect(() => {
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, language);
        }
      }
    }, [language, editorRef.current]);

    React.useEffect(() => {
      if (editorRef.current) {
        const model = editorRef.current.getModel();
        if (model && value && value !== model.getValue()) {
          // isChangingRef.current = true;
          // editorRef.current.pushUndoStop();
          model.pushEditOperations(
            [],
            [
              {
                range: model.getFullModelRange(),
                text: value,
              },
            ],
            () => null
          );
          // editorRef.current.pushUndoStop();
          // isChangingRef.current = false;
        }
      }
    }, [value, editorRef.current]);

    return (
      <div
        ref={containerRef}
        data-editor="next-monaco-editor"
        className={`${className} ${theme}`}
        style={{ ...processDimensions(width, height), ...style }}
      />
    );
  }
);

export default MonacoEditor;
