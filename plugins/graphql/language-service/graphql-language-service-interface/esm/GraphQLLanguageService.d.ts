import { DocumentNode, FragmentSpreadNode, NamedTypeNode, GraphQLSchema } from 'graphql';
import { CompletionItem, DefinitionQueryResult, Diagnostic, Uri, Position, Outline, GraphQLCacheInterface as GraphQLCache } from 'graphql-language-service-types';
import { ContextToken } from 'graphql-language-service-parser';
import { GraphQLConfig, GraphQLProjectConfig } from 'graphql-config';
import { Hover, SymbolInformation } from 'vscode-languageserver-types';
export declare class GraphQLLanguageService {
    _graphQLCache: GraphQLCache;
    _graphQLConfig: GraphQLConfig;
    _project: GraphQLProjectConfig;
    constructor(cache: GraphQLCache);
    getConfigForURI(uri: Uri): GraphQLProjectConfig;
    getSchema(projectName?: string, queryHasExtensions?: boolean): Promise<GraphQLSchema | null>;
    getProject(projectName: string): Promise<void>;
    getDiagnostics(query: string, uri: Uri, isRelayCompatMode?: boolean): Promise<Array<Diagnostic>>;
    getAutocompleteSuggestions(query: string, position: Position, filePath: Uri, contextToken?: ContextToken): Promise<Array<CompletionItem>>;
    getHoverInformation(query: string, position: Position, filePath: Uri): Promise<Hover['contents']>;
    getDefinition(query: string, position: Position, filePath: Uri): Promise<DefinitionQueryResult | null>;
    getDocumentSymbols(document: string, filePath: Uri): Promise<SymbolInformation[]>;
    _getDefinitionForNamedType(query: string, ast: DocumentNode, node: NamedTypeNode, filePath: Uri, projectConfig: GraphQLProjectConfig): Promise<DefinitionQueryResult | null>;
    _getDefinitionForFragmentSpread(query: string, ast: DocumentNode, node: FragmentSpreadNode, filePath: Uri, projectConfig: GraphQLProjectConfig): Promise<DefinitionQueryResult | null>;
    getOutline(documentText: string): Promise<Outline | null>;
}
//# sourceMappingURL=GraphQLLanguageService.d.ts.map