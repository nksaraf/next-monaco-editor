import { GraphQLSchema } from 'lib/plugins/graphql/language-service/graphql-language-service-interface/src/node_modules/graphql';
import { ContextToken } from 'lib/plugins/graphql/language-service/graphql-language-service-parser/src';
import { Position } from 'lib/plugins/graphql/language-service/graphql-language-service-types/src';
import { Hover } from 'lib/plugins/graphql/language-service/graphql-language-service-interface/src/node_modules/vscode-languageserver-types';
export declare function getHoverInformation(schema: GraphQLSchema, queryText: string, cursor: Position, contextToken?: ContextToken): Hover['contents'];
//# sourceMappingURL=getHoverInformation.d.ts.map