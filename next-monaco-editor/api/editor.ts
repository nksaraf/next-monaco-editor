import * as monaco from 'monaco-editor';
import { QuickSelectAction, IQuickSelectAction } from './QuickSelectAction';

declare module 'monaco-editor' {
  namespace editor  {
    interface IEditorOptions {
      formatOnSave?: boolean;
    }

    interface IStandaloneCodeEditor {
      addSelectAction: (action: IQuickSelectAction) => monaco.IDisposable
    }
  }
}

function setupCommandPaletteShortcuts(
  editor: monaco.editor.IStandaloneCodeEditor
) {
  // for firefox support (wasn't able to intercept key)
  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_C,
    () => {
      editor.trigger('ctrl-shift-c', 'editor.action.quickCommand', null);
    }
  );

  editor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_P,
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

const createMonacoEditor = monaco.editor.create;

monaco.editor.create = (domElement: HTMLElement, options?: monaco.editor.IStandaloneEditorConstructionOptions | undefined, override?: monaco.editor.IEditorOverrideServices | undefined) => {
  const editor = createMonacoEditor(domElement, options, override);

  if (options?.formatOnSave) {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
      () => {
        editor?.trigger(
          'ctrl-s',
          'editor.action.formatDocument',
          null
        );
      }
    );
  }

  editor.addSelectAction = function (descriptor) {
    return editor.addAction(
      new QuickSelectAction(descriptor, monaco) as any
    );
  };

  setupCommandPaletteShortcuts(editor);

  monaco.worker.setEditor(editor);
  return editor;
}