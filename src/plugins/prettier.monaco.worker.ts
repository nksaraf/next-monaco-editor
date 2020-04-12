import prettier from 'prettier/standalone';
import babylon from 'prettier/parser-babel';
import graphql from 'prettier/parser-graphql';
import html from 'prettier/parser-html';
import markdown from 'prettier/parser-markdown';
import{ BaseWorker, initialize } from '../worker';

class PrettierWorker extends BaseWorker {
	provideDocumentFormattingEdits : BaseWorker['provideDocumentFormattingEdits'] = async (model, other) => {
		const text = prettier.format(model.getValue(), {
      plugins: [babylon, markdown, graphql, html],
      singleQuote: true,
      ...this.options
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