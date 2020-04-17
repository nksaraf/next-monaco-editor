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

function setTheme(
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

function setupWorkerApi(
  monacoApi: typeof monaco,
  editor: monaco.editor.IStandaloneCodeEditor
  // defaultModel: monaco.editor.IModel
) {
  Object.assign(monacoApi.worker, {
    getDefault: async (model?: monaco.editor.IModel | null) => {
      if (!model) {
        model = editor.getModel();
      }
      if (!model) {
        return null;
      }
      const getWorker = await monacoApi.worker.getClient(
        (model as any).getLanguageIdentifier().language
      );
      const worker = await getWorker(model?.uri);
      return worker;
    },
    get: async (label: string, model?: monaco.editor.IModel | null) => {
      if (!model) {
        model = editor.getModel();
      }
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
  files?: { [key: string]: string };
  theme?: ThemeNames | monaco.editor.IStandaloneThemeData;
  themes?: { [key: string]: monaco.editor.IStandaloneThemeData };
  options?: monaco.editor.IEditorOptions;
  overrideServices?:
    | monaco.editor.IEditorOverrideServices
    | ((
        monacoApi: typeof monaco
        // model: monaco.editor.ITextModel
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

function useEditorRef() {
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  const useEditorEffect = (
    effect: (
      editor: monaco.editor.IStandaloneCodeEditor
    ) => void | (() => void),
    deps: any[]
  ) => {
    React.useEffect(() => {
      if (editorRef.current) {
        console.log(deps);
        return effect(editorRef.current);
      }
    }, [...deps]);
  };
  return { editorRef, useEditorEffect };
}

const fixPath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

function findModel(path: string) {
  path = fixPath(path);
  return (
    monaco.editor.getModels().find((model) => model.uri.path === path) || null
  );
}

function initializeModel(path: string, value?: string, language?: string) {
  path = fixPath(path);
  let model = findModel(path);

  if (model) {
    // If a model exists, we need to update it's value
    // This is needed because the content for the file might have been modified externally
    // Use `pushEditOperations` instead of `setValue` or `applyEdits` to preserve undo stack
    if (value) {
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
    }
  } else {
    model = monaco.editor.createModel(
      value || '',
      language,
      monaco.Uri.file(path)
    );
    model.updateOptions({
      tabSize: 2,
      insertSpaces: true,
    });
  }
}

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
      path = `model${
        // @ts-ignore
        (monaco.languages.getLanguages().find((l) => l.id === language)
          ?.extensions[0] as any) ?? '.js'
      }`,
      files = {
        [fixPath(path)]: value != null ? value : defaultValue,
      },
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
    const { editorRef, useEditorEffect } = useEditorRef();
    const subscriptionRef = React.useRef<monaco.IDisposable>(null);

    path = fixPath(path);

    React.useEffect(() => {
      if (!containerRef.current) {
        console.error('Assign container ref to something');
        return;
      }

      setupMonacoEnvironment(getWorkerUrl, getWorker);

      options = Object.assign(
        {
          automaticLayout: true,
          formatOnSave: true,
        },
        options,
        editorWillMount(monaco) || {}
      );

      plugins.forEach((plugin) => {
        plugin(monaco);
      });

      Object.keys(files).forEach((path) =>
        initializeModel(
          path,
          files[path]
          // language
        )
      );

      editorRef.current = monaco.editor.create(
        containerRef.current,
        options,
        typeof overrideServices === 'function'
          ? overrideServices(monaco)
          : overrideServices
      );

      // editor ref
      if (ref) {
        if (typeof ref === 'function') {
          ref(editorRef.current);
        } else {
          (ref as any).current = editorRef.current;
        }
      }
      console.log(monaco.languages.getLanguages());

      if (options.formatOnSave) {
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

      // CMD + Shift + P (like vscode), CMD + Shift + C
      setupCommandPaletteShortcuts(monaco, editorRef.current);
      setupThemes(monaco, editorRef.current, themes);
      setupWorkerApi(monaco, editorRef.current);

      // After initializing monaco editor
      editorDidMount(editorRef.current, monaco);

      return () => {
        if (editorRef.current) {
          editorRef.current.dispose();
        }
        monaco.editor.getModels().forEach((model) => {
          model.dispose();
        });
      };
    }, []);

    useEditorEffect(
      (editor) => {
        // var oldModel = editor.getModel();
        // if (oldModel) {
        //   editorStates.set(oldModel.uri.path, editor.saveViewState());
        // }
        initializeModel(path);
        const model = findModel(path);
        editor.setModel(model);
        // const editorState = editorStates.get(path);
        // if (editorState) {
        //   editor.restoreViewState(editorState);
        // }

        editor.focus();
      },
      [path]
    );

    useEditorEffect(
      (editor) => {
        // @ts-ignore
        subscriptionRef.current = editor.onDidChangeModelContent((event) => {
          if (editor) {
            onChange(editor?.getValue(), editor, event);
          }
        });
        return () => {
          if (subscriptionRef.current) {
            subscriptionRef.current.dispose();
          }
        };
      },
      [onChange]
    );

    // React.useEffect(() => {
    //   if (editorRef.current) {
    //     editorRef.current.setScrollPosition({ scrollTop: line });
    //   }
    // }, [line, editorRef.current]);

    React.useEffect(() => {
      setTheme(monaco, theme);
    }, [theme]);

    useEditorEffect(
      (editor) => {
        editor.updateOptions(options);
      },
      [options]
    );

    useEditorEffect(
      (editor) => {
        const model = editor.getModel();
        if (model) {
          monaco.editor.setModelLanguage(model, language);
        }
      },
      [language]
    );

    useEditorEffect(
      (editor) => {
        const model = editor.getModel();
        let value = files[path];
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
      },
      [files[path]]
    );

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
