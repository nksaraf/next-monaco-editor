import monaco from 'monaco-editor';
// @ts-ignore
import { BaseEditorQuickOpenAction } from 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/editorQuickOpen';
// @ts-ignore
import {
  QuickOpenModel,
  QuickOpenEntry,
  // @ts-ignore
} from 'monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenModel';
// @ts-ignore
import { matchesFuzzy } from 'monaco-editor/esm/vs/base/common/filters';

export type IQuickSelectAction = Omit<
  monaco.editor.IActionDescriptor,
  'run'
> & {
  choices?: () => Promise<string[]> | string[];
  runChoice?: (
    choice: string,
    mode: number,
    context: any,
    api: typeof monaco
  ) => Promise<boolean | void> | boolean | void;
  runAction?: (
    editor: monaco.editor.IStandaloneCodeEditor,
    api: typeof monaco
  ) => Promise<void>;
};

export class QuickSelectAction extends BaseEditorQuickOpenAction {
  choices?: IQuickSelectAction['choices'];
  runChoice: IQuickSelectAction['runChoice'];
  id?: string;
  label?: string;
  precondition?: string;
  keybindings?: number[];
  keybindingContext?: string;
  contextMenuGroupId?: string;
  contextMenuOrder?: number;
  runAction?: IQuickSelectAction['runAction'];
  api: typeof monaco;
  constructor(descriptor: IQuickSelectAction, api: typeof monaco) {
    super(descriptor.label, descriptor);
    Object.assign(this, descriptor);
    const _this: any = this;
    this.runAction =
      descriptor?.runAction ??
      (async function (editor: any, api: any, payload: any) {
        await _this.show(editor, payload);
        return;
      } as any);
    this.api = api;
  }
  getOptions(
    editor: monaco.editor.IStandaloneCodeEditor,
    choices: string[],
    searchValue: string
  ) {
    const _this = this;
    const entries: QuickOpenEntry[] = [];
    choices.forEach((name) => {
      var highlights = matchesFuzzy(searchValue, name);
      if (highlights) {
        const entry = new QuickOpenEntry();
        entry.getLabel = () => name;
        entry.setHighlights(highlights);
        entry.run = function (mode: number, context: any) {
          if (mode === 0) {
            _this.runChoice?.(name, mode, context, _this.api);
            return false;
          } else if (mode === 1 /* OPEN */) {
            // Use a timeout to give the quick open widget a chance to close itself first
            setTimeout(function () {
              // Some actions are enabled only when editor has focus
              editor.focus();
              _this.runChoice?.(name, mode, context, _this.api);
            }, 50);
            return true;
          }
        };
        entries.push(entry);
      }
    });
    return entries;
  }
  async show(editor: monaco.editor.IStandaloneCodeEditor) {
    const _this: any = this;
    const choices = await _this.choices();
    _this._show(_this.getController(editor), {
      getModel: function (value: string) {
        return new QuickOpenModel(
          _this.getOptions(editor, choices, value)
          // _this._editorActionsToEntries(keybindingService, editor, value)
        );
      },
      getAutoFocus: function (searchValue: string) {
        return {
          autoFocusFirstEntry: true,
          autoFocusPrefixMatch: searchValue,
        };
      },
    });
  }
  run() {
    const editor = arguments[0];
    const _this = this;
    return _this.runAction?.apply(_this, [editor, monaco]);
  }
}

// export class SetThemeAction extends QuickSelectAction {
//   constructor() {
//     super();
//   }
//   // _getThemeEntries(editor, searchValue) {
//   //   const _this = this;
//   //   const entries = [];
//   //   Object.keys(themeNames).forEach((name) => {
//   //     var highlights = matchesFuzzy(searchValue, name);
//   //     if (highlights) {
//   //       const entry = new QuickOpenEntry();
//   //       entry.getLabel = () => name;
//   //       entry.setHighlights(highlights);
//   //       entry.run = function (mode, context) {
//   //         if (mode === 0) {
//   //           _this.api.editor.setTheme(themeNames[name]);
//   //           return false;
//   //         } else if (mode === 1 /* OPEN */) {
//   //           // Use a timeout to give the quick open widget a chance to close itself first
//   //           setTimeout(function () {
//   //             // Some actions are enabled only when editor has focus
//   //             editor.focus();
//   //             _this.api.editor.setTheme(themeNames[name]);
//   //             localStorage.setItem('theme', themeNames[name]);
//   //           }, 50);
//   //           return true;
//   //         }
//   //       };
//   //       entries.push(entry);
//   //     }
//   //   });
//   //   return entries;
//   // }

//   // run() {
//   //   const editor: monaco.editor.IStandaloneCodeEditor = arguments[0];
//   //   const currentTheme = editor._themeService._theme.themeName;
//   //   this.show(editor);
//   //   const _this = this;
//   //   const controller = _this.getController(editor);
//   //   const oldDestroy = controller.widget.quickOpenWidget.callbacks.onCancel;
//   //   controller.widget.quickOpenWidget.callbacks.onCancel = function () {
//   //     monaco.editor.setTheme(currentTheme);
//   //     oldDestroy();
//   //   };
//   //   return Promise.resolve();
//   // }
// }
