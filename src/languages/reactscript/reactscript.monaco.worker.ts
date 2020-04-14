import{ BaseWorker, initialize } from 'next-monaco-editor/worker';

class ReactScriptWorker extends BaseWorker {
	provideHover: BaseWorker['provideHover'] = (model, position) => {
		return {
			contents: [{
				value: "Hello world"}]
		}
	}
}

initialize(ReactScriptWorker);