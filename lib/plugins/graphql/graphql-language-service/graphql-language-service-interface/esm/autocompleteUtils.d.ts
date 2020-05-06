import { GraphQLField, GraphQLSchema, GraphQLType } from 'lib/plugins/graphql/language-service/graphql-language-service-interface/src/node_modules/graphql';
import { CompletionItemBase, AllTypeInfo } from 'lib/plugins/graphql/language-service/graphql-language-service-types/src';
import { ContextTokenUnion, State } from 'lib/plugins/graphql/language-service/graphql-language-service-parser/src';
export declare function getDefinitionState(tokenState: State): State | null | undefined;
export declare function getFieldDef(schema: GraphQLSchema, type: GraphQLType, fieldName: string): GraphQLField<any, any> | null | undefined;
export declare function forEachState(stack: State, fn: (state: State) => AllTypeInfo | null | void): void;
export declare function objectValues(object: Record<string, any>): Array<any>;
export declare function hintList<T extends CompletionItemBase>(token: ContextTokenUnion, list: Array<T>): Array<T>;
//# sourceMappingURL=autocompleteUtils.d.ts.map