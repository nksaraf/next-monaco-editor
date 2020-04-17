import {
  BaseWorker,
  initialize,
  IWorkerContext,
} from 'next-monaco-editor/worker';
import monaco from 'next-monaco-editor/api';

import {
  Range as GraphQLRange,
  Position as GraphQLPosition,
} from 'graphql-language-service-types';

import {
  //   // Diagnostic,

  // getDiagnostics,
  // Diagnostic,
  // getRange,
  // getAutocompleteSuggestions,
  getRange,
  getTokenAtPosition,
} from 'graphql-language-service-interface';

import { LanguageService } from './LanguageService';
import { RuleKinds } from 'graphql-language-service-parser';
import {
  visit,
  SelectionSetNode,
  GraphQLScalarType,
  GraphQLNonNull,
} from 'graphql';
import { CompletionItemKind } from 'vscode-languageserver-types';

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

const getBaseType = (t: any) : 'scalar' | 'object' => {
  if (t.ofType) {
    return getBaseType(t.ofType);
  }

  if (t instanceof GraphQLScalarType) {
    return 'scalar';
  } else {
    return 'object';
  }
};

export function toCompletion(
  // entry: GraphQLCompletionItem,
  { astNode, ...entry }: any,
  range: monaco.IRange
): monaco.languages.CompletionItem {
  let insertText = entry.insertText || entry.label;
  let command = undefined;

  if (entry.kind === CompletionItemKind.Field) {
    const isObject = astNode && getBaseType(astNode.type) === 'object';
    const hasNonNullArg =
      astNode &&
      astNode.args.length > 0 &&
      astNode.args.some((arg) => arg.type instanceof GraphQLNonNull);
    if (isObject && hasNonNullArg) {
      insertText += '(${1:}) {${2:}}';
    } else if (isObject) {
      insertText += ' {\n  ${1:}\n}';
    } else if (hasNonNullArg) {
      insertText += '(${1:})';
    }

    if (isObject || hasNonNullArg) {
      command = {
        id: 'editor.action.triggerSuggest',
      };
    }
  } else if (entry.kind === CompletionItemKind.Variable) {
    // console.log(astNode)
    insertText += ': ';
  }

  return {
    ...entry,
    insertText,
    command,
    insertTextRules: 4,
    range,
    kind: entry.kind as any,
  } as any;
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
    console.log(options);
    this.languageService = new LanguageService({
      uri: this.options.settings.uri,
      headers: this.options.settings.headers
    });
  }

  async getAST(uri: string) {
    const ast = await this.languageService.parse(this.getModel(uri)?.getValue());
    return ast;
  }

  provideCompletionItems : BaseWorker['provideCompletionItems'] = async (
    model,
    position,
    context) =>  {
      const graphQLPosition = toGraphQLPosition(position);
    const token = getTokenAtPosition(model.getValue(), graphQLPosition);
    const state =
      token.state.kind === 'Invalid' ? token.state.prevState : token.state;

    console.log(context, state);
    let range: any = null;
      range = {
        startLineNumber: position.lineNumber,
        startColumn: position.column - (!(context.triggerKind === 1 && context.triggerCharacter === '\n') ? state.name ? state.name.length : 0:  0),
        endColumn: position.column,
        endLineNumber: position.lineNumber,
      };

    let suggestions = await this.languageService.getCompletion(
      model.getValue(),
      graphQLPosition
    );
    if (
      state.kind === RuleKinds.SELECTION_SET ||
      state.kind === RuleKinds.FIELD ||
      state.kindnd === RuleKinds.ALIASED_FIELD
    ) {
      try {
        const ast = await this.languageService.parse(model.getValue());
        let offset = model.offsetAt(position);
        let lowest: SelectionSetNode | null = null;
        visit(ast, {
          SelectionSet: (val) => {
            if (
              val.loc?.start &&
              val.loc?.start <= offset &&
              val.loc?.end &&
              offset <= val.loc?.end
            ) {
              lowest = val;
            }
          },
        });

        if (lowest !== null) {
          suggestions = suggestions.filter(
            (sug) =>
              !lowest?.selections.some(
                (sel) => (sel as any).name.value === sug.label
              )
          );
        }
      } catch (e) {}
    }

    return {
      incomplete: true,
      suggestions: suggestions.map((suggestion) =>
        toCompletion(suggestion, range)
      ),
    };
  };

  resolveCompletionItem: BaseWorker['resolveCompletionItem'] = async (
    model,
    position,
    item
  ) => {
    return item;
  };

  provideHover: BaseWorker['provideHover'] = async (model, position) => {
    const graphQLPosition = toGraphQLPosition(position);
    const hover = await this.languageService.getHover(
      model.getValue(),
      graphQLPosition
    );

    if (hover) {
      return <monaco.languages.Hover>{
        contents: [{ value: hover }],
        range: toMonacoRange(
          getRange(
            {
              column: graphQLPosition.character + 1,
              line: graphQLPosition.line + 1,
            },
            model.getValue()
          )
        ),
      };
    }

    return null;
  };
}

initialize(GraphQLWorker);
