import monaco from './api';
import React from 'react';
import { processSize, noop } from './utils';

export interface MonacoEditorProps {
  width?: string | number;
  height?: string | number;
  value?: string;
  defaultValue?: string;
  line?: number;
  style?: React.CSSProperties;
  fileName?: string;
  language?: string;
  theme?: string | monaco.editor.IStandaloneThemeData;
  options?: monaco.editor.IEditorOptions;
  overrideServices?: monaco.editor.IEditorOverrideServices;
  className?: string;
  getWorkerUrl?: monaco.Environment['getWorkerUrl'];
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
  language = 'javascript',
  theme = 'vs-dark',
  fileName = 'model.js',
  options = {},
  overrideServices = {},
  editorDidMount = noop,
  editorWillMount = noop,
  onChange = noop,
}: MonacoEditorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  const isChanging = React.useRef(false);

  React.useEffect(() => {
    if (!containerRef.current) {
      console.error('Assign container ref to something');
      return;
    } else {
      console.log(containerRef.current);
    }
    const textValue = value != null ? value : defaultValue;
    let subscription;

    // @ts-ignore
    window.MonacoEnvironment.getWorkerUrl = (
      _moduleId: string,
      label: string
    ) => {
      console.log(_moduleId, label);
      const url = getWorkerUrl(_moduleId, label);
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
    // window.MonacoEnvironment.getWorker = (_moduleId: string, label: string) => {
    //   console.log(_moduleId, label);
    //   if (label === "other") return new XmlWorker();
    // };

    console.log(monaco.languages);

    Object.assign(options, editorWillMount(monaco) || {});
    const model = monaco.editor.createModel(
      textValue,
      language,
      monaco.Uri.file(fileName)
    );

    editorRef.current = monaco.editor.create(
      containerRef.current,
      {
        model,
        language,
        automaticLayout: true,
        ...options,
      },
      overrideServices
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

    subscription = editorRef.current.onDidChangeModelContent(event => {
      if (!isChanging.current && editorRef.current) {
        onChange(editorRef?.current?.getValue(), editorRef?.current, event);
      }
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        const model = editorRef.current.getModel();
        if (model) {
          model.dispose();
        }
      }
      if (subscription) {
        subscription.dispose();
      }
    };
  }, []);

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
        isChanging.current = true;
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
        isChanging.current = false;
      }
    }
  }, [value]);

  const fixedWidth = processSize(width);
  const fixedHeight = processSize(height);
  const dimensions = {
    width: fixedWidth,
    height: fixedHeight,
  };

  return (
    <div
      ref={containerRef}
      data-editor="next-monaco-editor"
      className={className}
      style={{ ...dimensions, ...style }}
    />
  );
}
