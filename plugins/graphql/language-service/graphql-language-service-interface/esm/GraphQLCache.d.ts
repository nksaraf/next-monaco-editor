import { ASTNode } from 'lib/plugins/graphql/language-service/graphql-language-service-interface/src/node_modules/graphql/language';
import { CachedContent, GraphQLFileMetadata, GraphQLFileInfo, FragmentInfo, ObjectTypeInfo, Uri } from 'lib/plugins/graphql/language-service/graphql-language-service-types/src';
import { GraphQLSchema } from 'lib/plugins/graphql/language-service/graphql-language-service-interface/src/node_modules/graphql';
import { GraphQLConfig, GraphQLProjectConfig } from 'lib/plugins/graphql/language-service/graphql-language-service-interface/src/node_modules/graphql-config';
import { parseDocument } from '../src/parseDocument';
export declare function getGraphQLCache(configDir: Uri, parser: typeof parseDocument, extensions?: Array<(config: GraphQLConfig) => GraphQLConfig>, config?: GraphQLConfig): Promise<GraphQLCache>;
export declare class GraphQLCache {
    _configDir: Uri;
    _graphQLFileListCache: Map<Uri, Map<string, GraphQLFileInfo>>;
    _graphQLConfig: GraphQLConfig;
    _schemaMap: Map<Uri, GraphQLSchema>;
    _typeExtensionMap: Map<Uri, number>;
    _fragmentDefinitionsCache: Map<Uri, Map<string, FragmentInfo>>;
    _typeDefinitionsCache: Map<Uri, Map<string, ObjectTypeInfo>>;
    _parser: typeof parseDocument;
    constructor(configDir: Uri, graphQLConfig: GraphQLConfig, parser: typeof parseDocument);
    getGraphQLConfig: () => GraphQLConfig;
    getFragmentDependencies: (query: string, fragmentDefinitions?: Map<string, FragmentInfo> | null | undefined) => Promise<FragmentInfo[]>;
    getFragmentDependenciesForAST: (parsedQuery: ASTNode, fragmentDefinitions: Map<string, FragmentInfo>) => Promise<FragmentInfo[]>;
    getFragmentDefinitions: (projectConfig: GraphQLProjectConfig) => Promise<Map<string, FragmentInfo>>;
    getObjectTypeDependencies: (query: string, objectTypeDefinitions?: Map<string, ObjectTypeInfo> | undefined) => Promise<ObjectTypeInfo[]>;
    getObjectTypeDependenciesForAST: (parsedQuery: ASTNode, objectTypeDefinitions: Map<string, ObjectTypeInfo>) => Promise<ObjectTypeInfo[]>;
    getObjectTypeDefinitions: (projectConfig: GraphQLProjectConfig) => Promise<Map<string, ObjectTypeInfo>>;
    _readFilesFromInputDirs: (rootDir: string, includes: string[]) => Promise<GraphQLFileMetadata[]>;
    _updateGraphQLFileListCache(graphQLFileMap: Map<Uri, GraphQLFileInfo>, metrics: {
        size: number;
        mtime: number;
    }, filePath: Uri, exists: boolean): Promise<Map<Uri, GraphQLFileInfo>>;
    updateFragmentDefinition(rootDir: Uri, filePath: Uri, contents: Array<CachedContent>): Promise<void>;
    updateFragmentDefinitionCache(rootDir: Uri, filePath: Uri, exists: boolean): Promise<void>;
    updateObjectTypeDefinition(rootDir: Uri, filePath: Uri, contents: Array<CachedContent>): Promise<void>;
    updateObjectTypeDefinitionCache(rootDir: Uri, filePath: Uri, exists: boolean): Promise<void>;
    _extendSchema(schema: GraphQLSchema, schemaPath: string | null, schemaCacheKey: string | null): GraphQLSchema;
    getSchema: (appName?: string | undefined, queryHasExtensions?: boolean | null | undefined) => Promise<GraphQLSchema | null>;
    _invalidateSchemaCacheForProject(projectConfig: GraphQLProjectConfig): void;
    _getSchemaCacheKeyForProject(projectConfig: GraphQLProjectConfig): string | {
        [key: string]: any;
    } | import("lib/plugins/graphql/language-service/graphql-language-service-interface/src/node_modules/@graphql-toolkit/core").UnnormalizedTypeDefPointer[];
    _getProjectName(projectConfig: GraphQLProjectConfig): GraphQLProjectConfig;
    readAllGraphQLFiles: (list: GraphQLFileMetadata[]) => Promise<{
        objectTypeDefinitions: Map<string, ObjectTypeInfo>;
        fragmentDefinitions: Map<string, FragmentInfo>;
        graphQLFileMap: Map<string, GraphQLFileInfo>;
    }>;
    processGraphQLFiles: (responses: GraphQLFileInfo[]) => {
        objectTypeDefinitions: Map<string, ObjectTypeInfo>;
        fragmentDefinitions: Map<string, FragmentInfo>;
        graphQLFileMap: Map<string, GraphQLFileInfo>;
    };
    promiseToReadGraphQLFile: (filePath: string) => Promise<GraphQLFileInfo>;
}
//# sourceMappingURL=GraphQLCache.d.ts.map