import { Diagnostic as DiagnosticType, CompletionItem as CompletionItemType } from 'plugins/graphql/language-service/graphql-language-service-types/src/node_modules/vscode-languageserver-types';
import { ASTNode, GraphQLSchema } from 'plugins/graphql/language-service/graphql-language-service-types/src/node_modules/graphql';
import { DocumentNode, FragmentDefinitionNode, NamedTypeNode, TypeDefinitionNode, NameNode } from 'plugins/graphql/language-service/graphql-language-service-types/src/node_modules/graphql/language';
import { GraphQLArgument, GraphQLEnumValue, GraphQLField, GraphQLInputFieldMap, GraphQLType } from 'plugins/graphql/language-service/graphql-language-service-types/src/node_modules/graphql/type/definition';
import { GraphQLDirective } from 'plugins/graphql/language-service/graphql-language-service-types/src/node_modules/graphql/type/directives';
export declare type Maybe<T> = T | null | undefined;
import { GraphQLConfig, GraphQLProjectConfig, GraphQLExtensionDeclaration } from 'plugins/graphql/language-service/graphql-language-service-types/src/node_modules/graphql-config';
export { GraphQLConfig, GraphQLProjectConfig, GraphQLExtensionDeclaration };
export interface GraphQLCacheInterface {
    getGraphQLConfig: () => GraphQLConfig;
    getObjectTypeDependencies: (query: string, fragmentDefinitions: Map<string, ObjectTypeInfo>) => Promise<ObjectTypeInfo[]>;
    getObjectTypeDependenciesForAST: (parsedQuery: ASTNode, fragmentDefinitions: Map<string, ObjectTypeInfo>) => Promise<ObjectTypeInfo[]>;
    getObjectTypeDefinitions: (graphQLConfig: GraphQLProjectConfig) => Promise<Map<string, ObjectTypeInfo>>;
    updateObjectTypeDefinition: (rootDir: Uri, filePath: Uri, contents: CachedContent[]) => Promise<void>;
    updateObjectTypeDefinitionCache: (rootDir: Uri, filePath: Uri, exists: boolean) => Promise<void>;
    getFragmentDependencies: (query: string, fragmentDefinitions: Maybe<Map<string, FragmentInfo>>) => Promise<FragmentInfo[]>;
    getFragmentDependenciesForAST: (parsedQuery: ASTNode, fragmentDefinitions: Map<string, FragmentInfo>) => Promise<FragmentInfo[]>;
    getFragmentDefinitions: (graphQLConfig: GraphQLProjectConfig) => Promise<Map<string, FragmentInfo>>;
    updateFragmentDefinition: (rootDir: Uri, filePath: Uri, contents: CachedContent[]) => Promise<void>;
    updateFragmentDefinitionCache: (rootDir: Uri, filePath: Uri, exists: boolean) => Promise<void>;
    getSchema: (appName?: string, queryHasExtensions?: boolean) => Promise<GraphQLSchema | null>;
}
export declare type Position = {
    line: number;
    character: number;
    lessThanOrEqualTo?: (position: Position) => boolean;
};
export interface Range {
    start: Position;
    end: Position;
    containsPosition: (position: Position) => boolean;
}
export declare type CachedContent = {
    query: string;
    range: Range | null;
};
export declare type Uri = string;
export declare type GraphQLFileMetadata = {
    filePath: Uri;
    size: number;
    mtime: number;
};
export declare type GraphQLFileInfo = {
    filePath: Uri;
    content: string;
    asts: DocumentNode[];
    queries: CachedContent[];
    size: number;
    mtime: number;
};
export declare type AllTypeInfo = {
    type: Maybe<GraphQLType>;
    parentType: Maybe<GraphQLType>;
    inputType: Maybe<GraphQLType>;
    directiveDef: Maybe<GraphQLDirective>;
    fieldDef: Maybe<GraphQLField<any, any>>;
    enumValue: Maybe<GraphQLEnumValue>;
    argDef: Maybe<GraphQLArgument>;
    argDefs: Maybe<GraphQLArgument[]>;
    objectFieldDefs: Maybe<GraphQLInputFieldMap>;
};
export declare type FragmentInfo = {
    filePath?: Uri;
    content: string;
    definition: FragmentDefinitionNode;
};
export declare type NamedTypeInfo = {
    filePath?: Uri;
    content: string;
    definition: NamedTypeNode;
};
export declare type ObjectTypeInfo = {
    filePath?: Uri;
    content: string;
    definition: TypeDefinitionNode;
};
export declare type Diagnostic = DiagnosticType;
export declare type CompletionItemBase = {
    label: string;
    isDeprecated?: boolean;
};
export declare type CompletionItem = CompletionItemType & {
    isDeprecated?: boolean;
    deprecationReason?: Maybe<string>;
};
export declare type CompletionItemForCodeMirror = {
    label: string;
    type?: GraphQLType;
    documentation: string | null | undefined;
    isDeprecated?: boolean;
    deprecationReason: string | null | undefined;
};
export declare type Definition = {
    path: Uri;
    position: Position;
    range?: Range;
    id?: string;
    name?: string;
    language?: string;
    projectRoot?: Uri;
};
export declare type DefinitionQueryResult = {
    queryRange: Range[];
    definitions: Definition[];
};
export declare type TokenKind = 'keyword' | 'class-name' | 'constructor' | 'method' | 'param' | 'string' | 'whitespace' | 'plain' | 'type';
export declare type TextToken = {
    kind: TokenKind;
    value: string | NameNode;
};
export declare type TokenizedText = TextToken[];
export declare type OutlineTree = {
    plainText?: string;
    tokenizedText?: TokenizedText;
    representativeName?: string;
    kind: string;
    startPosition: Position;
    endPosition?: Position;
    children: OutlineTree[];
};
export declare type Outline = {
    outlineTrees: OutlineTree[];
};
export interface FileEvent {
    uri: string;
    type: FileChangeType;
}
export declare const FileChangeTypeKind: {
    Created: number;
    Changed: number;
    Deleted: number;
};
export declare type FileChangeTypeKind = {
    Created: 1;
    Changed: 2;
    Deleted: 3;
};
export declare type FileChangeTypeKeys = keyof FileChangeTypeKind;
export declare type FileChangeType = FileChangeTypeKind[FileChangeTypeKeys];
//# sourceMappingURL=index.d.ts.map