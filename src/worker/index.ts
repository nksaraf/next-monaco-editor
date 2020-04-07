import * as monacoWorker from 'monaco-editor/esm/vs/editor/editor.worker';
import * as monaco from 'monaco-editor';

export interface IMirrorModel {
  readonly uri: monaco.Uri;
  readonly version: number;
  getValue(): string;
}

export interface IWorkerContext<H = undefined> {
  /**
   * A proxy to the main thread host object.
   */
  host: H;
  /**
   * Get all available mirror models in this worker.
   */
  getMirrorModels(): IMirrorModel[];
}

interface IWorker {
  initialize: (
    initalizer: (ctx: IWorkerContext, createData: any) => any
  ) => void;
}

const worker : IWorker = monacoWorker;

export { worker };
export default worker;
