// @ts-ignore
import  prettier from 'prettier/standalone';
import{ BaseWorker, initialize, IWorkerContext } from 'next-monaco-editor/worker';

declare global {
  // const prettier: any
  const prettierPlugins: any
}

class PrettierWorker extends BaseWorker {
  options: { parser: string, plugins: string[] };
  loader: Promise<any>;
  constructor(ctx: IWorkerContext<undefined>, config: { parser: string, plugins: string[] }) {
    super(ctx, config);
    this.options = config;
    this.loader = this.importPrettier();
  }

  async importPrettier() {
    await importScripts("https://unpkg.com/prettier@2.0.4/standalone.js");
    for (var plugin of this.options.plugins) {
      await importScripts(`https://unpkg.com/prettier@2.0.4/${plugin}.js`);
    }
  }

	provideDocumentFormattingEdits : BaseWorker['provideDocumentFormattingEdits'] = async (model) => {
    await this.loader;
    const { plugins,...options } = this.options;
		const text = prettier.format(model.getValue(), {
      plugins: prettierPlugins,
      singleQuote: true,
      ...options
    });

    return [
      {
        range: model.getFullModelRange(),
        text,
      },
    ];
	}
}

initialize(PrettierWorker);