import React from 'react';
import { noop, processDimensions, getNextWorkerPath, fixPath } from './utils';
import monaco from './api';
import defaultThemes, { ThemeNames, themeNames } from './themes';

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
    choices: () => Object.keys(themeNames),
    runChoice: (choice, mode, ctx, api) => {
      if (mode === 0) {
        api.editor.setTheme(themeNames[choice]);
      } else if (mode === 1) {
        api.editor.setTheme(themeNames[choice]);
      }
    },
    runAction: function (editor: any, api: any) {
      const _this: any = this;
      const currentTheme = editor._themeService._theme.themeName;
      console.log(currentTheme);
      const controller = _this.getController(editor);
      const oldDestroy = controller.widget.quickOpenWidget.callbacks.onCancel;
      controller.widget.quickOpenWidget.callbacks.onCancel = function () {
        debugger;
        monaco.editor.setTheme(currentTheme);
        oldDestroy();
      };
      console.log(
        controller,
        controller.widget.quickOpenWidget.callbacks.onCancel,
        this
      );
      _this.show(editor);
      return Promise.resolve();
    },
  });
}

const getNextWorkerUrl = (label: string) => {
  if (label === 'editorWorkerService') {
    return getNextWorkerPath('editor');
  }

  if (label === 'typescript' || label === 'javascript') {
    return getNextWorkerPath('ts');
  }

  return getNextWorkerPath(label);
};

export interface MonacoEditorProps {
  width?: string | number;
  height?: string | number;
  value?: string;
  id?: string;
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
  onPathChange?: (
    path: string,
    editor: monaco.editor.IStandaloneCodeEditor,
    monacoApi: typeof monaco
  ) => void;
  onThemeChange?: (theme: string, monacoApi: typeof monaco) => void;
  onChange?: (
    newValue: string,
    editor: monaco.editor.IStandaloneCodeEditor,
    event: monaco.editor.IModelContentChangedEvent,
    monacoApi: typeof monaco
  ) => void;
  plugins?: monaco.plugin.IPlugin[];
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
        return effect(editorRef.current);
      }
    }, [...deps]);
  };

  return { editorRef, useEditorEffect };
}

function findModel(path: string) {
  return monaco.editor.getModel(monaco.Uri.file(fixPath(path)));
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
      id = 'monaco',
      defaultValue = '',
      style = {},
      className = 'next-editor',
      line = 0,
      getWorkerUrl = getNextWorkerUrl,
      getWorker = noop as any,
      language,
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
      onThemeChange = (theme) => localStorage.setItem(`${id}-theme`, theme),
      onPathChange = noop,
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

      monaco.worker.setEnvironment(getWorkerUrl, getWorker);

      options = Object.assign(
        {
          automaticLayout: true,
          formatOnSave: true,
        },
        options,
        editorWillMount(monaco) || {}
      );

      const pluginDisposables = monaco.plugin.install(...plugins);

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

      // CMD + Shift + P (like vscode), CMD + Shift + C
      const disposable = monaco.editor.onDidChangeTheme((theme) =>
        onThemeChange(theme, monaco)
      );

      setupThemes(monaco, editorRef.current, themes);

      // After initializing monaco editor
      editorDidMount(editorRef.current, monaco);

      return () => {
        disposable.dispose();

        if (editorRef.current) {
          editorRef.current.dispose();
        }
        // pluginDisposables.dispose();
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
        initializeModel(path, files[path]);
        const model = findModel(path);

        editor.setModel(model);
        if (onPathChange) {
          onPathChange(path, editor, monaco);
        }
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
            onChange(editor?.getValue(), editor, event, monaco);
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
      monaco.editor.setTheme(theme);
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
        if (model && language) {
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
        style={{
          overflow: 'hidden',
          ...processDimensions(width, height),
          ...style,
        }}
      />
    );
  }
);

export default MonacoEditor;
