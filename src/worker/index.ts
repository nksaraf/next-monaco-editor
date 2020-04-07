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


export class BaseWorker {
  ctx: IWorkerContext;
  config: any;
  constructor(_ctx, _config) {
    this.ctx = _ctx;
    this.config = _config;
  }

  getModels() {
    return this.ctx.getMirrorModels();
  }

  getModel(uri: string) {
    for (let model of this.getModels()) {
			if (model.uri.toString() === uri) {
				return model;
			}
		}
		return null;
  }
}

export const initialize = (Worker: typeof BaseWorker) => {
	self.onmessage = () => {
		worker.initialize((ctx, createData) => {
			return new Worker(ctx, createData);
		});
	}
}


export { worker };
export default worker;
