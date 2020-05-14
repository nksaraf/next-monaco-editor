export * from './components/SplitPanes';
export * from './components/Editor';
export * from './components/JSONViewer';
export * from './components/SandboxHead';
export * from './components/ActionButton';
export * from './components/Modal';
export * from './components/Icons';
export * from './hooks';

import * as MONACO from './monaco';
declare namespace M {
  export type monaco = typeof MONACO.monaco;
}

export type monaco = M.monaco;
