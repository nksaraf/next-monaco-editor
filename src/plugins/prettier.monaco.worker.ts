import prettier from 'prettier/standalone';
import babylon from 'prettier/parser-babel';
import{ BaseWorker, initialize } from 'next-monaco-editor/worker';

class PrettierWorker extends BaseWorker {
	provideDocumentFormattingEdits = (model) => {
		const text = prettier.format(model.getValue(), {
      parser: 'babel',
      plugins: [babylon],
      singleQuote: true,
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