import { FragmentDefinitionNode, GraphQLDirective, GraphQLSchema } from 'graphql';
import { CompletionItem, ContextToken, State, AllTypeInfo, Position } from 'graphql-language-service-types';
import { CharacterStream } from 'graphql-language-service-parser';
export declare function getAutocompleteSuggestions(schema: GraphQLSchema, queryText: string, cursor: Position, contextToken?: ContextToken): Array<CompletionItem>;
export declare function getFragmentDefinitions(queryText: string): Array<FragmentDefinitionNode>;
export declare function getTokenAtPosition(queryText: string, cursor: Position): ContextToken;
declare type callbackFnType = (stream: CharacterStream, state: State, style: string, index: number) => void | 'BREAK';
export declare function runOnlineParser(queryText: string, callback: callbackFnType): ContextToken;
export declare function canUseDirective(state: State['prevState'], directive: GraphQLDirective): boolean;
export declare function getTypeInfo(schema: GraphQLSchema, tokenState: State): AllTypeInfo;
export {};
//# sourceMappingURL=getAutocompleteSuggestions.d.ts.map