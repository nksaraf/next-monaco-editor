import { FragmentSpreadNode, FragmentDefinitionNode, OperationDefinitionNode, NamedTypeNode } from 'lib/plugins/graphql/language-service/graphql-language-service-interface/src/node_modules/graphql';
import { DefinitionQueryResult, FragmentInfo, Uri, ObjectTypeInfo } from 'lib/plugins/graphql/language-service/graphql-language-service-types/src';
export declare const LANGUAGE = "GraphQL";
export declare function getDefinitionQueryResultForNamedType(text: string, node: NamedTypeNode, dependencies: Array<ObjectTypeInfo>): Promise<DefinitionQueryResult>;
export declare function getDefinitionQueryResultForFragmentSpread(text: string, fragment: FragmentSpreadNode, dependencies: Array<FragmentInfo>): Promise<DefinitionQueryResult>;
export declare function getDefinitionQueryResultForDefinitionNode(path: Uri, text: string, definition: FragmentDefinitionNode | OperationDefinitionNode): DefinitionQueryResult;
//# sourceMappingURL=getDefinition.d.ts.map