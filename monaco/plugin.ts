import * as monaco from 'monaco-editor';
import { asDisposable } from './utils';

declare module 'monaco-editor' {
  namespace plugin {
    interface IPlugin {
      (monacoApi: typeof monaco): monaco.IDisposable | void
    }

    function install(...plugins: IPlugin[]): monaco.IDisposable
  }
}

// @ts-ignore
monaco.plugin = {
  install: (...plugins: monaco.plugin.IPlugin[]) => {
    const disposables : monaco.IDisposable[] = []
    plugins.forEach(plugin => {
      let disposable = plugin(monaco);
      disposable && disposables.push(disposable);
    });
    return asDisposable(disposables);
  }
}