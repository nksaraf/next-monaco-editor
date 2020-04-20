import * as monaco from 'monaco-editor';

export function asDisposable(disposables: monaco.IDisposable[]): monaco.IDisposable {
  return { dispose: () => disposeAll(disposables) };
}

export function disposeAll(disposables: monaco.IDisposable[]) {
  while (disposables.length) {
    disposables.pop()?.dispose();
  }
}