import React from 'react';
import { noop, processDimensions, getNextWorkerPath } from './utils';
import monaco from './api';
import defaultThemes, { ThemeNames } from './themes';
import './css/monaco.css';
import { SetThemeAction } from './themes/SelectThemeAction';

const commandPaletteShortcuts = (
  monacoApi: typeof monaco,
  editor: monaco.editor.IStandaloneCodeEditor
) => {
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
};

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
      // @ts-ignore
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
      window.MonacoEnvironment.getWorker = (
        _moduleId: string,
        label: string
      ) => {
        const worker = getWorker(label);
        if (worker) return worker;

        return new Worker(getWorkerPath(_moduleId, label));
      };

      const textValue = value != null ? value : defaultValue;
      const properPath = path.startsWith('/') ? path : `/${path}`;

      Object.assign(options, editorWillMount(monaco) || {});

      plugins.forEach((plugin) => {
        plugin(monaco);
      });

      let model = monaco.editor
        .getModels()
        .find((model) => model.uri.path === properPath);

      if (!model) {
        model = monaco.editor.createModel(
          textValue,
          language,
          monaco.Uri.file(properPath)
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

      const allThemes = {
        ...defaultThemes,
        ...themes,
      };

      editorRef.current.updateOptions({ tabSize: 2 });

      Object.keys(allThemes).forEach((themeName) => {
        monaco.editor.defineTheme(
          themeName,
          allThemes[themeName as keyof typeof allThemes]
        );
      });

      // Set current theme based on predefined themes or if object, set as a custom theme
      if (typeof theme === 'string') {
        monaco.editor.setTheme(theme);
      } else {
        monaco.editor.defineTheme('custom', theme);
        monaco.editor.setTheme('custom');
      }

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
      commandPaletteShortcuts(monaco, editorRef.current);
      editorRef.current.addAction(new SetThemeAction(monaco) as any);

      Object.assign(monaco.worker, {
        getDefault: async () => {
          if (!model) {
            return null;
          }
          const getWorker = await monaco.worker.getClient(
            (model as any).getLanguageIdentifier().language
          );
          const worker = await getWorker(model?.uri);
          return worker;
        },
        get: async (label: string) => {
          if (!model) {
            return null;
          }
          const getWorker = await monaco.worker.getClient(label);
          const worker = await getWorker(model?.uri);
          return worker;
        },
      });

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
            console.log('here');
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

    React.useEffect(() => {
      if (editorRef.current) {
        editorRef.current.setScrollPosition({ scrollTop: line });
      }
    }, [line, editorRef.current]);

    React.useEffect(() => {
      if (typeof theme === 'string') {
        monaco.editor.setTheme(theme);
      } else {
        monaco.editor.defineTheme('custom', theme);
        monaco.editor.setTheme('custom');
      }
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
          editorRef.current.pushUndoStop();
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
          editorRef.current.pushUndoStop();
          // isChangingRef.current = false;
        }
      }
    }, [value, editorRef.current]);

    return (
      <div
        ref={containerRef}
        data-editor="next-monaco-editor"
        className={className}
        style={{ ...processDimensions(width, height), ...style }}
      />
    );
  }
);

export default MonacoEditor;
