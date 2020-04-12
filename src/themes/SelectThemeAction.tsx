import monaco from '../api';
import { themeNames } from '.';
import { BaseEditorQuickOpenAction } from 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/editorQuickOpen';
import {
  QuickOpenModel,
  QuickOpenEntry,
} from 'monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenModel';
import { matchesFuzzy } from 'monaco-editor/esm/vs/base/common/filters';

class QuickSelectAction extends BaseEditorQuickOpenAction {
  constructor()
}

export class SetThemeAction extends BaseEditorQuickOpenAction {
  api: typeof monaco;
  constructor(api) {
    super('select theme', {
      id: 'editor.action.selectTheme',
      label: 'Set Theme',
      alias: 'Set Color Theme',
    });
    this.api = api;
  }
  _getThemeEntries(editor, searchValue) {
    const _this = this;
    const entries = [];
    Object.keys(themeNames).forEach((name) => {
      var highlights = matchesFuzzy(searchValue, name);
      if (highlights) {
        const entry = new QuickOpenEntry();
        entry.getLabel = () => name;
        entry.setHighlights(highlights);
        entry.run = function (mode, context) {
          if (mode === 0) {
            _this.api.editor.setTheme(themeNames[name]);
            return false;
          } else if (mode === 1 /* OPEN */) {
            // Use a timeout to give the quick open widget a chance to close itself first
            setTimeout(function () {
              // Some actions are enabled only when editor has focus
              editor.focus();
              _this.api.editor.setTheme(themeNames[name]);
              localStorage.setItem('theme', themeNames[name]);
            }, 50);
            return true;
          }
        };
        entries.push(entry);
      }
    });
    return entries;
  }

  run() {
    const _this: any = this;
    const editor = arguments[0];
    const currentTheme = editor._themeService._theme.themeName;
    _this._show(_this.getController(editor), {
      getModel: function (value) {
        return new QuickOpenModel(
          _this._getThemeEntries(editor, value)
          // _this._editorActionsToEntries(keybindingService, editor, value)
        );
      },
      getAutoFocus: function (searchValue) {
        return {
          autoFocusFirstEntry: true,
          autoFocusPrefixMatch: searchValue,
        };
      },
    });
    const controller = _this.getController(editor);
    const oldDestroy = controller.widget.quickOpenWidget.callbacks.onCancel;
    controller.widget.quickOpenWidget.callbacks.onCancel = function () {
      _this.api.editor.setTheme(currentTheme);
      oldDestroy();
    };
    return Promise.resolve();
  }
}
