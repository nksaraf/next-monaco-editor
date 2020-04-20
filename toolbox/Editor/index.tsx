import { Editor } from './Editor';

export { Editor };

export const monacoStyles = {
  '.monaco-menu .monaco-action-bar.vertical .action-menu-item': {
    height: '1em !important',
  },
  '.monaco-menu .monaco-action-bar.vertical': {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '.monaco-menu .monaco-action-bar.vertical .submenu-indicator.codicon::before': {
    marginRight: '-8px !important',
  },
  '.monaco-editor *': {
    boxSizing: 'content-box',
  },
};

export default Editor;
