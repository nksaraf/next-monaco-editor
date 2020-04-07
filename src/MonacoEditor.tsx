import monaco from './api';
import React from 'react';
import { noop, processDimensions } from './utils';

export interface MonacoEditorProps {
  width?: string | number;
  height?: string | number;
  value?: string;
  defaultValue?: string;
  line?: number;
  style?: React.CSSProperties;
  path?: string;
  language?: string;
  theme?: string | monaco.editor.IStandaloneThemeData;
  themes?: { [key: string]: monaco.editor.IStandaloneThemeData };
  options?: monaco.editor.IEditorOptions;
  overrideServices?:
    | monaco.editor.IEditorOverrideServices
    | ((
        _monaco: typeof monaco,
        model: monaco.editor.ITextModel
      ) => monaco.editor.IEditorOverrideServices);
  className?: string;
  getWorker?: (label: string) => Worker | undefined;
  getWorkerUrl?: (label: string) => string | undefined;
  editorDidMount?: (
    editor: monaco.editor.IStandaloneCodeEditor,
    _monaco: typeof monaco
  ) => void;
  editorWillMount?: (
    _monaco: typeof monaco
  ) => monaco.editor.IEditorOptions | void;
  onChange?: (
    newValue: string,
    editor: monaco.editor.IStandaloneCodeEditor,
    event: monaco.editor.IModelContentChangedEvent
  ) => void;
}

const getNextWorkerPath = label => {
  return `_next/static/${label}.monaco.worker.js`;
};

export default function MonacoEditor({
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
  options = {},
  overrideServices = {},
  editorDidMount = noop,
  editorWillMount = noop,
  onChange = noop,
}: MonacoEditorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  const isChangingRef = React.useRef(false);
  const subscriptionRef = React.useRef<monaco.IDisposable>(null);

  React.useEffect(() => {
    if (!containerRef.current) {
      console.error('Assign container ref to something');
      return;
    }

    const textValue = value != null ? value : defaultValue;

    // @ts-ignore
    window.MonacoEnvironment.getWorkerUrl = (
      _moduleId: string,
      label: string
    ) => {
      console.log('Getting worker URL:', label);
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
      console.log('Getting worker:', label);
      const worker = getWorker(label);
      if (worker) return worker;
    };

    Object.assign(options, editorWillMount(monaco) || {});

    let model = monaco.editor
      .getModels()
      .find(model => model.uri.path === path);

    if (!model) {
      model = monaco.editor.createModel(
        textValue,
        language,
        monaco.Uri.file(path)
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

    if (typeof theme === 'string') {
      monaco.editor.setTheme(theme);
    } else {
      monaco.editor.defineTheme('custom', theme);
      monaco.editor.setTheme('custom');
    }

    const newMonaco = {
      ...monaco,
      getModelWorker: async () => {
        const getWorker = await monaco.languages.getWorker(language);
        const worker = await getWorker(model.uri);
        return worker;
      },
    };

    // After initializing monaco editor
    editorDidMount(editorRef.current, newMonaco);

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        const model = editorRef.current.getModel();
        if (model) {
          model.dispose();
        }
      }
    };
  }, [containerRef.current]);

  React.useEffect(() => {
    subscriptionRef.current = editorRef.current.onDidChangeModelContent(
      event => {
        if (!isChangingRef.current && editorRef.current) {
          onChange(editorRef?.current?.getValue(), editorRef?.current, event);
        }
      }
    );

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.dispose();
      }
    };
  }, [onChange]);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setScrollPosition({ scrollTop: line });
    }
  }, [line]);

  React.useEffect(() => {
    if (editorRef.current) {
      if (typeof theme === 'string') {
        monaco.editor.setTheme(theme);
      } else {
        monaco.editor.defineTheme('custom', theme);
        monaco.editor.setTheme('custom');
      }
    }
  }, [theme]);

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions(options);
    }
  }, [options]);

  React.useEffect(() => {
    if (editorRef.current) {
      monaco.editor.setModelLanguage(editorRef.current.getModel(), language);
    }
  }, [language]);

  React.useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && value && value !== model.getValue()) {
        isChangingRef.current = true;
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
        isChangingRef.current = false;
      }
    }
  }, [value]);

  return (
    <div
      ref={containerRef}
      data-editor="next-monaco-editor"
      className={className}
      style={{ ...processDimensions(width, height), ...style }}
    />
  );
}
