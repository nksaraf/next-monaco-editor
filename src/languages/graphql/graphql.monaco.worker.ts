import{ BaseWorker, initialize, IWorkerContext } from 'next-monaco-editor/worker';
import monaco from 'next-monaco-editor/api';

import { Range as GraphQLRange,
	Position as GraphQLPosition,
	CompletionItem as GraphQLCompletionItem
 } from 'graphql-language-service-types';

import {
  //   // Diagnostic,
  
    // getDiagnostics,
    // Diagnostic,
    // getRange,
    // getAutocompleteSuggestions,
		getTokenRange, getRange,
    
	} from 'graphql-language-service-interface';

	import { LanguageService } from './LanguageService';

export function toMonacoRange(range: GraphQLRange): monaco.IRange {
  return {
    startLineNumber: range.start.line + 1,
    startColumn: range.start.character + 1,
    endLineNumber: range.end.line + 1,
    endColumn: range.end.character + 1,
  };
}

export function toGraphQLPosition(position: monaco.Position): GraphQLPosition {
  return { line: position.lineNumber - 1, character: position.column - 1 };
}

// // export function toMarkerData(
// //   diagnostic: Diagnostic,
// // ): monaco.editor.IMarkerData {
// //   return {
// //     startLineNumber: diagnostic.range.start.line + 1,
// //     endLineNumber: diagnostic.range.end.line + 1,
// //     startColumn: diagnostic.range.start.character + 1,
// //     endColumn: diagnostic.range.end.character + 1,
// //     message: diagnostic.message,
// //     severity: 5 || (diagnostic.severity as monaco.MarkerSeverity),
// //     code: (diagnostic.code as string) || undefined,
// //   };
// // }


// export type MonacoCompletionItem = monaco.languages.CompletionItem & {
//   isDeprecated?: boolean;
//   deprecationReason?: string | null;
// };

export function toCompletion(
  entry: GraphQLCompletionItem,
  range: monaco.IRange,
): monaco.languages.CompletionItem  {
  return {
    label: entry.label,
    insertText: entry.insertText || (entry.label as string),
    sortText: entry.sortText,
    filterText: entry.filterText,
    documentation: entry.documentation,
    detail: entry.detail,
    range: range,
    kind: entry.kind as any,
  };
}

// export class GraphQLWorker {
//   private _ctx: monaco.worker.IWorkerContext;
//   // @ts-ignore
//   // private _languageService: graphqlService.LanguageService;
//   // private schema: GraphQLSchema | null;
//   constructor(ctx: monaco.worker.IWorkerContext, createData: ICreateData) {
//     this._ctx = ctx;
//     // this.schema = null;
//   }
//   async doValidation(uri: string): Promise<monaco.editor.IMarkerData[]> {
//     const document = this._getTextDocument(uri);
//     // @ts-ignore
//     const graphqlDiagnostics = await getDiagnostics(document, schema);
//     return graphqlDiagnostics.map(toMarkerData);
//   }

class GraphQLWorker extends BaseWorker {
	languageService: LanguageService;
	constructor(ctx: IWorkerContext<undefined>, options: any) {
		super(ctx, options);
		this.languageService = new LanguageService({
			uri: this.options.uri
		});
	}

	provideCompletionItems: BaseWorker['provideCompletionItems'] = async (model, position, context) => {
    const graphQLPosition = toGraphQLPosition(position);
    
    let range = toMonacoRange(getRange(
      {
        column: graphQLPosition.character + 1,
        line: graphQLPosition.line + 1,
      },
      model.getValue(),
    ));
    if (context.triggerCharacter && context.triggerCharacter === '\n') {
      range = {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endColumn: position.column,
        endLineNumber: position.lineNumber
      }
    }

		const suggestions = await this.languageService.getCompletion(model.getValue(), graphQLPosition);
		return { incomplete: true,
			suggestions: suggestions.map(suggestion =>
      toCompletion(
        suggestion,
        range,
      ),
		)};
  }
  
  resolveCompletionItem:  BaseWorker['resolveCompletionItem'] = async (model, position, item) => {
    return item;
  }

	provideHover: BaseWorker['provideHover'] = async (model, position) => {
		const graphQLPosition = toGraphQLPosition(position);
		const hover = await this.languageService.getHover(model.getValue(), graphQLPosition);

		if (hover) {
			return <monaco.languages.Hover>{
				contents: [{ value: hover }],
				range: toMonacoRange(
					getTokenRange(
						{
							column: graphQLPosition.character + 1,
							line: graphQLPosition.line + 1,
						},
						model.getValue(),
					),
				),
			};
		}
		
		return null;
	}
}

initialize(GraphQLWorker);