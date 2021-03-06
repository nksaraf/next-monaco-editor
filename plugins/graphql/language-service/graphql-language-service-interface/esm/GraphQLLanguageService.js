import { SymbolKind, } from 'vscode-languageserver-types';
import { Kind, parse, print } from 'graphql';
import { getAutocompleteSuggestions } from './getAutocompleteSuggestions';
import { getHoverInformation } from './getHoverInformation';
import { validateQuery, getRange, DIAGNOSTIC_SEVERITY } from './getDiagnostics';
import { getDefinitionQueryResultForFragmentSpread, getDefinitionQueryResultForDefinitionNode, getDefinitionQueryResultForNamedType, } from './getDefinition';
import { getOutline } from './getOutline';
import { getASTNodeAtPosition } from 'graphql-language-service-utils';
const { FRAGMENT_DEFINITION, OBJECT_TYPE_DEFINITION, INTERFACE_TYPE_DEFINITION, ENUM_TYPE_DEFINITION, UNION_TYPE_DEFINITION, SCALAR_TYPE_DEFINITION, INPUT_OBJECT_TYPE_DEFINITION, SCALAR_TYPE_EXTENSION, OBJECT_TYPE_EXTENSION, INTERFACE_TYPE_EXTENSION, UNION_TYPE_EXTENSION, ENUM_TYPE_EXTENSION, INPUT_OBJECT_TYPE_EXTENSION, DIRECTIVE_DEFINITION, FRAGMENT_SPREAD, OPERATION_DEFINITION, NAMED_TYPE, } = Kind;
const KIND_TO_SYMBOL_KIND = {
    [Kind.FIELD]: SymbolKind.Field,
    [Kind.OPERATION_DEFINITION]: SymbolKind.Class,
    [Kind.FRAGMENT_DEFINITION]: SymbolKind.Class,
    [Kind.FRAGMENT_SPREAD]: SymbolKind.Struct,
    [Kind.OBJECT_TYPE_DEFINITION]: SymbolKind.Class,
    [Kind.ENUM_TYPE_DEFINITION]: SymbolKind.Enum,
    [Kind.ENUM_VALUE_DEFINITION]: SymbolKind.EnumMember,
    [Kind.INPUT_OBJECT_TYPE_DEFINITION]: SymbolKind.Class,
    [Kind.INPUT_VALUE_DEFINITION]: SymbolKind.Field,
    [Kind.FIELD_DEFINITION]: SymbolKind.Field,
    [Kind.INTERFACE_TYPE_DEFINITION]: SymbolKind.Interface,
    [Kind.DOCUMENT]: SymbolKind.File,
    FieldWithArguments: SymbolKind.Method,
};
function getKind(tree) {
    if (tree.kind === 'FieldDefinition' &&
        tree.children &&
        tree.children.length > 0) {
        return KIND_TO_SYMBOL_KIND.FieldWithArguments;
    }
    return KIND_TO_SYMBOL_KIND[tree.kind];
}
export class GraphQLLanguageService {
    constructor(cache) {
        this._graphQLCache = cache;
        this._graphQLConfig = cache.getGraphQLConfig();
        this._project = this._graphQLConfig.getDefault();
    }
    getConfigForURI(uri) {
        const config = this._graphQLConfig.getProjectForFile(uri);
        if (config) {
            return config;
        }
        throw Error(`No config found for uri: ${uri}`);
    }
    async getSchema(projectName, queryHasExtensions) {
        try {
            const schema = projectName
                ? await this._graphQLCache.getSchema(projectName, queryHasExtensions)
                : await this._graphQLConfig.getDefault().getSchema();
            return schema;
        }
        catch (err) {
            console.warn('no schema found');
            return null;
        }
    }
    async getProject(projectName) {
        this._project = this._graphQLConfig.getProject(projectName);
    }
    async getDiagnostics(query, uri, isRelayCompatMode) {
        let queryHasExtensions = false;
        const projectConfig = this.getConfigForURI(uri);
        if (!projectConfig) {
            return [];
        }
        const { schema: schemaPath, name: projectName, extensions } = projectConfig;
        try {
            const queryAST = parse(query);
            if (!schemaPath || uri !== schemaPath) {
                queryHasExtensions = queryAST.definitions.some(definition => {
                    switch (definition.kind) {
                        case OBJECT_TYPE_DEFINITION:
                        case INTERFACE_TYPE_DEFINITION:
                        case ENUM_TYPE_DEFINITION:
                        case UNION_TYPE_DEFINITION:
                        case SCALAR_TYPE_DEFINITION:
                        case INPUT_OBJECT_TYPE_DEFINITION:
                        case SCALAR_TYPE_EXTENSION:
                        case OBJECT_TYPE_EXTENSION:
                        case INTERFACE_TYPE_EXTENSION:
                        case UNION_TYPE_EXTENSION:
                        case ENUM_TYPE_EXTENSION:
                        case INPUT_OBJECT_TYPE_EXTENSION:
                        case DIRECTIVE_DEFINITION:
                            return true;
                    }
                    return false;
                });
            }
        }
        catch (error) {
            const range = getRange(error.locations[0], query);
            return [
                {
                    severity: DIAGNOSTIC_SEVERITY.Error,
                    message: error.message,
                    source: 'GraphQL: Syntax',
                    range,
                },
            ];
        }
        let source = query;
        const fragmentDefinitions = await this._graphQLCache.getFragmentDefinitions(projectConfig);
        const fragmentDependencies = await this._graphQLCache.getFragmentDependencies(query, fragmentDefinitions);
        const dependenciesSource = fragmentDependencies.reduce((prev, cur) => `${prev} ${print(cur.definition)}`, '');
        source = `${source} ${dependenciesSource}`;
        let validationAst = null;
        try {
            validationAst = parse(source);
        }
        catch (error) {
            return [];
        }
        let customRules = null;
        const customValidationRules = extensions.customValidationRules;
        if (customValidationRules) {
            customRules = customValidationRules(this._graphQLConfig);
        }
        const schema = await this._graphQLCache.getSchema(projectName, queryHasExtensions);
        if (!schema) {
            return [];
        }
        return validateQuery(validationAst, schema, customRules, isRelayCompatMode);
    }
    async getAutocompleteSuggestions(query, position, filePath, contextToken) {
        const projectConfig = this.getConfigForURI(filePath);
        const schema = await this.getSchema(projectConfig.name);
        if (schema) {
            return getAutocompleteSuggestions(schema, query, position, contextToken);
        }
        return [];
    }
    async getHoverInformation(query, position, filePath) {
        const projectConfig = this.getConfigForURI(filePath);
        const schema = await this.getSchema(projectConfig.name);
        if (schema) {
            return getHoverInformation(schema, query, position);
        }
        return '';
    }
    async getDefinition(query, position, filePath) {
        const projectConfig = this.getConfigForURI(filePath);
        let ast;
        try {
            ast = parse(query);
        }
        catch (error) {
            return null;
        }
        const node = getASTNodeAtPosition(query, ast, position);
        if (node) {
            switch (node.kind) {
                case FRAGMENT_SPREAD:
                    return this._getDefinitionForFragmentSpread(query, ast, node, filePath, projectConfig);
                case FRAGMENT_DEFINITION:
                case OPERATION_DEFINITION:
                    return getDefinitionQueryResultForDefinitionNode(filePath, query, node);
                case NAMED_TYPE:
                    return this._getDefinitionForNamedType(query, ast, node, filePath, projectConfig);
            }
        }
        return null;
    }
    async getDocumentSymbols(document, filePath) {
        const outline = await this.getOutline(document);
        if (!outline) {
            return [];
        }
        const output = [];
        const input = outline.outlineTrees.map((tree) => [null, tree]);
        while (input.length > 0) {
            const res = input.pop();
            if (!res) {
                return [];
            }
            const [parent, tree] = res;
            if (!tree) {
                return [];
            }
            output.push({
                name: tree.representativeName,
                kind: getKind(tree),
                location: {
                    uri: filePath,
                    range: {
                        start: tree.startPosition,
                        end: tree.endPosition,
                    },
                },
                containerName: parent ? parent.representativeName : undefined,
            });
            input.push(...tree.children.map(child => [tree, child]));
        }
        return output;
    }
    async _getDefinitionForNamedType(query, ast, node, filePath, projectConfig) {
        const objectTypeDefinitions = await this._graphQLCache.getObjectTypeDefinitions(projectConfig);
        const dependencies = await this._graphQLCache.getObjectTypeDependenciesForAST(ast, objectTypeDefinitions);
        const localObjectTypeDefinitions = ast.definitions.filter(definition => definition.kind === OBJECT_TYPE_DEFINITION ||
            definition.kind === INPUT_OBJECT_TYPE_DEFINITION ||
            definition.kind === ENUM_TYPE_DEFINITION ||
            definition.kind === SCALAR_TYPE_DEFINITION ||
            definition.kind === INTERFACE_TYPE_DEFINITION);
        const typeCastedDefs = localObjectTypeDefinitions;
        const localOperationDefinationInfos = typeCastedDefs.map((definition) => ({
            filePath,
            content: query,
            definition,
        }));
        const result = await getDefinitionQueryResultForNamedType(query, node, dependencies.concat(localOperationDefinationInfos));
        return result;
    }
    async _getDefinitionForFragmentSpread(query, ast, node, filePath, projectConfig) {
        const fragmentDefinitions = await this._graphQLCache.getFragmentDefinitions(projectConfig);
        const dependencies = await this._graphQLCache.getFragmentDependenciesForAST(ast, fragmentDefinitions);
        const localFragDefinitions = ast.definitions.filter(definition => definition.kind === FRAGMENT_DEFINITION);
        const typeCastedDefs = localFragDefinitions;
        const localFragInfos = typeCastedDefs.map((definition) => ({
            filePath,
            content: query,
            definition,
        }));
        const result = await getDefinitionQueryResultForFragmentSpread(query, node, dependencies.concat(localFragInfos));
        return result;
    }
    async getOutline(documentText) {
        return getOutline(documentText);
    }
}
//# sourceMappingURL=GraphQLLanguageService.js.map