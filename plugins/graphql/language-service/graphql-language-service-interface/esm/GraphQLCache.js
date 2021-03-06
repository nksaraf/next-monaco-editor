import * as fs from 'fs';
import { Kind, extendSchema, parse, visit } from 'graphql';
import nullthrows from 'nullthrows';
import { loadConfig, } from 'graphql-config';
import stringToHash from './stringToHash';
import glob from 'glob';
const MAX_READS = 200;
const { DOCUMENT, FRAGMENT_DEFINITION, OBJECT_TYPE_DEFINITION, INTERFACE_TYPE_DEFINITION, ENUM_TYPE_DEFINITION, UNION_TYPE_DEFINITION, SCALAR_TYPE_DEFINITION, INPUT_OBJECT_TYPE_DEFINITION, SCALAR_TYPE_EXTENSION, OBJECT_TYPE_EXTENSION, INTERFACE_TYPE_EXTENSION, UNION_TYPE_EXTENSION, ENUM_TYPE_EXTENSION, INPUT_OBJECT_TYPE_EXTENSION, DIRECTIVE_DEFINITION, } = Kind;
export async function getGraphQLCache(configDir, parser, extensions, config) {
    let graphQLConfig = config ?? (await loadConfig({ rootDir: configDir }));
    if (extensions && extensions.length > 0) {
        for await (const extension of extensions) {
            graphQLConfig = await extension(graphQLConfig);
        }
    }
    return new GraphQLCache(configDir, graphQLConfig, parser);
}
export class GraphQLCache {
    constructor(configDir, graphQLConfig, parser) {
        this.getGraphQLConfig = () => this._graphQLConfig;
        this.getFragmentDependencies = async (query, fragmentDefinitions) => {
            if (!fragmentDefinitions) {
                return [];
            }
            let parsedQuery;
            try {
                parsedQuery = parse(query, {
                    allowLegacySDLImplementsInterfaces: true,
                    allowLegacySDLEmptyFields: true,
                });
            }
            catch (error) {
                return [];
            }
            return this.getFragmentDependenciesForAST(parsedQuery, fragmentDefinitions);
        };
        this.getFragmentDependenciesForAST = async (parsedQuery, fragmentDefinitions) => {
            if (!fragmentDefinitions) {
                return [];
            }
            const existingFrags = new Map();
            const referencedFragNames = new Set();
            visit(parsedQuery, {
                FragmentDefinition(node) {
                    existingFrags.set(node.name.value, true);
                },
                FragmentSpread(node) {
                    if (!referencedFragNames.has(node.name.value)) {
                        referencedFragNames.add(node.name.value);
                    }
                },
            });
            const asts = new Set();
            referencedFragNames.forEach(name => {
                if (!existingFrags.has(name) && fragmentDefinitions.has(name)) {
                    asts.add(nullthrows(fragmentDefinitions.get(name)));
                }
            });
            const referencedFragments = [];
            asts.forEach(ast => {
                visit(ast.definition, {
                    FragmentSpread(node) {
                        if (!referencedFragNames.has(node.name.value) &&
                            fragmentDefinitions.get(node.name.value)) {
                            asts.add(nullthrows(fragmentDefinitions.get(node.name.value)));
                            referencedFragNames.add(node.name.value);
                        }
                    },
                });
                if (!existingFrags.has(ast.definition.name.value)) {
                    referencedFragments.push(ast);
                }
            });
            return referencedFragments;
        };
        this.getFragmentDefinitions = async (projectConfig) => {
            const rootDir = projectConfig.dirpath;
            if (this._fragmentDefinitionsCache.has(rootDir)) {
                return this._fragmentDefinitionsCache.get(rootDir) || new Map();
            }
            const filesFromInputDirs = await this._readFilesFromInputDirs(rootDir, projectConfig.include instanceof Array
                ? projectConfig.include
                : projectConfig.include
                    ? [projectConfig.include]
                    : []);
            const list = filesFromInputDirs.filter(fileInfo => projectConfig.match(fileInfo.filePath));
            const { fragmentDefinitions, graphQLFileMap, } = await this.readAllGraphQLFiles(list);
            this._fragmentDefinitionsCache.set(rootDir, fragmentDefinitions);
            this._graphQLFileListCache.set(rootDir, graphQLFileMap);
            return fragmentDefinitions;
        };
        this.getObjectTypeDependencies = async (query, objectTypeDefinitions) => {
            if (!objectTypeDefinitions) {
                return [];
            }
            let parsedQuery;
            try {
                parsedQuery = parse(query, {
                    allowLegacySDLImplementsInterfaces: true,
                    allowLegacySDLEmptyFields: true,
                });
            }
            catch (error) {
                return [];
            }
            return this.getObjectTypeDependenciesForAST(parsedQuery, objectTypeDefinitions);
        };
        this.getObjectTypeDependenciesForAST = async (parsedQuery, objectTypeDefinitions) => {
            if (!objectTypeDefinitions) {
                return [];
            }
            const existingObjectTypes = new Map();
            const referencedObjectTypes = new Set();
            visit(parsedQuery, {
                ObjectTypeDefinition(node) {
                    existingObjectTypes.set(node.name.value, true);
                },
                InputObjectTypeDefinition(node) {
                    existingObjectTypes.set(node.name.value, true);
                },
                EnumTypeDefinition(node) {
                    existingObjectTypes.set(node.name.value, true);
                },
                NamedType(node) {
                    if (!referencedObjectTypes.has(node.name.value)) {
                        referencedObjectTypes.add(node.name.value);
                    }
                },
            });
            const asts = new Set();
            referencedObjectTypes.forEach(name => {
                if (!existingObjectTypes.has(name) && objectTypeDefinitions.has(name)) {
                    asts.add(nullthrows(objectTypeDefinitions.get(name)));
                }
            });
            const referencedObjects = [];
            asts.forEach(ast => {
                visit(ast.definition, {
                    NamedType(node) {
                        if (!referencedObjectTypes.has(node.name.value) &&
                            objectTypeDefinitions.get(node.name.value)) {
                            asts.add(nullthrows(objectTypeDefinitions.get(node.name.value)));
                            referencedObjectTypes.add(node.name.value);
                        }
                    },
                });
                if (!existingObjectTypes.has(ast.definition.name.value)) {
                    referencedObjects.push(ast);
                }
            });
            return referencedObjects;
        };
        this.getObjectTypeDefinitions = async (projectConfig) => {
            const rootDir = projectConfig.dirpath;
            if (this._typeDefinitionsCache.has(rootDir)) {
                return this._typeDefinitionsCache.get(rootDir) || new Map();
            }
            const filesFromInputDirs = await this._readFilesFromInputDirs(rootDir, projectConfig.include instanceof Array
                ? projectConfig.include
                : projectConfig.include
                    ? [projectConfig.include]
                    : []);
            const list = filesFromInputDirs.filter(fileInfo => projectConfig.match(fileInfo.filePath));
            const { objectTypeDefinitions, graphQLFileMap, } = await this.readAllGraphQLFiles(list);
            this._typeDefinitionsCache.set(rootDir, objectTypeDefinitions);
            this._graphQLFileListCache.set(rootDir, graphQLFileMap);
            return objectTypeDefinitions;
        };
        this._readFilesFromInputDirs = (rootDir, includes) => {
            let pattern;
            if (includes.length === 0) {
                return Promise.resolve([]);
            }
            if (includes.length === 1) {
                pattern = includes[0];
            }
            else {
                pattern = `{${includes.join(',')}}`;
            }
            return new Promise((resolve, reject) => {
                const globResult = new glob.Glob(pattern, {
                    cwd: rootDir,
                    stat: true,
                    absolute: false,
                    ignore: [
                        'generated/relay',
                        '**/__flow__/**',
                        '**/__generated__/**',
                        '**/__github__/**',
                        '**/__mocks__/**',
                        '**/node_modules/**',
                        '**/__flowtests__/**',
                    ],
                }, error => {
                    if (error) {
                        reject(error);
                    }
                });
                globResult.on('end', () => {
                    resolve(Object.keys(globResult.statCache)
                        .filter(filePath => typeof globResult.statCache[filePath] === 'object')
                        .map(filePath => {
                        const cacheEntry = globResult.statCache[filePath];
                        return {
                            filePath,
                            mtime: Math.trunc(cacheEntry.mtime.getTime() / 1000),
                            size: cacheEntry.size,
                        };
                    }));
                });
            });
        };
        this.getSchema = async (appName, queryHasExtensions) => {
            const projectConfig = this._graphQLConfig.getProject(appName);
            if (!projectConfig) {
                return null;
            }
            const schemaPath = projectConfig.schema;
            const schemaKey = this._getSchemaCacheKeyForProject(projectConfig);
            let schemaCacheKey = null;
            let schema = null;
            if (!schema && schemaPath && schemaKey) {
                schemaCacheKey = schemaKey;
                if (this._schemaMap.has(schemaCacheKey)) {
                    schema = this._schemaMap.get(schemaCacheKey);
                    if (schema) {
                        return queryHasExtensions
                            ? this._extendSchema(schema, schemaPath, schemaCacheKey)
                            : schema;
                    }
                }
                schema = await projectConfig.getSchema();
            }
            const customDirectives = projectConfig?.extensions?.customDirectives;
            if (customDirectives && schema) {
                const directivesSDL = customDirectives.join('\n\n');
                schema = extendSchema(schema, parse(directivesSDL, {
                    allowLegacySDLImplementsInterfaces: true,
                    allowLegacySDLEmptyFields: true,
                }));
            }
            if (!schema) {
                return null;
            }
            if (this._graphQLFileListCache.has(this._configDir)) {
                schema = this._extendSchema(schema, schemaPath, schemaCacheKey);
            }
            if (schemaCacheKey) {
                this._schemaMap.set(schemaCacheKey, schema);
            }
            return schema;
        };
        this.readAllGraphQLFiles = async (list) => {
            const queue = list.slice();
            const responses = [];
            while (queue.length) {
                const chunk = queue.splice(0, MAX_READS);
                const promises = chunk.map(fileInfo => this.promiseToReadGraphQLFile(fileInfo.filePath)
                    .catch(error => {
                    if (error.code === 'EMFILE' || error.code === 'ENFILE') {
                        queue.push(fileInfo);
                    }
                })
                    .then((response) => {
                    if (response) {
                        responses.push({
                            ...response,
                            mtime: fileInfo.mtime,
                            size: fileInfo.size,
                        });
                    }
                }));
                await Promise.all(promises);
            }
            return this.processGraphQLFiles(responses);
        };
        this.processGraphQLFiles = (responses) => {
            const objectTypeDefinitions = new Map();
            const fragmentDefinitions = new Map();
            const graphQLFileMap = new Map();
            responses.forEach(response => {
                const { filePath, content, asts, mtime, size } = response;
                if (asts) {
                    asts.forEach(ast => {
                        ast.definitions.forEach(definition => {
                            if (definition.kind === FRAGMENT_DEFINITION) {
                                fragmentDefinitions.set(definition.name.value, {
                                    filePath,
                                    content,
                                    definition,
                                });
                            }
                            if (definition.kind === OBJECT_TYPE_DEFINITION ||
                                definition.kind === INPUT_OBJECT_TYPE_DEFINITION ||
                                definition.kind === ENUM_TYPE_DEFINITION) {
                                objectTypeDefinitions.set(definition.name.value, {
                                    filePath,
                                    content,
                                    definition,
                                });
                            }
                        });
                    });
                }
                graphQLFileMap.set(filePath, {
                    filePath,
                    content,
                    asts,
                    mtime,
                    size,
                });
            });
            return {
                objectTypeDefinitions,
                fragmentDefinitions,
                graphQLFileMap,
            };
        };
        this.promiseToReadGraphQLFile = (filePath) => {
            return new Promise((resolve, reject) => fs.readFile(filePath, 'utf8', (error, content) => {
                if (error) {
                    reject(error);
                    return;
                }
                const asts = [];
                let queries = [];
                if (content.trim().length !== 0) {
                    try {
                        queries = this._parser(content, filePath);
                        if (queries.length === 0) {
                            resolve({
                                filePath,
                                content,
                                asts: [],
                                queries: [],
                                mtime: 0,
                                size: 0,
                            });
                            return;
                        }
                        queries.forEach(({ query }) => asts.push(parse(query, {
                            allowLegacySDLImplementsInterfaces: true,
                            allowLegacySDLEmptyFields: true,
                        })));
                        resolve({
                            filePath,
                            content,
                            asts,
                            queries,
                            mtime: 0,
                            size: 0,
                        });
                    }
                    catch (_) {
                        resolve({
                            filePath,
                            content,
                            asts: [],
                            queries: [],
                            mtime: 0,
                            size: 0,
                        });
                        return;
                    }
                }
                resolve({ filePath, content, asts, queries, mtime: 0, size: 0 });
            }));
        };
        this._configDir = configDir;
        this._graphQLConfig = graphQLConfig;
        this._graphQLFileListCache = new Map();
        this._schemaMap = new Map();
        this._fragmentDefinitionsCache = new Map();
        this._typeDefinitionsCache = new Map();
        this._typeExtensionMap = new Map();
        this._parser = parser;
    }
    async _updateGraphQLFileListCache(graphQLFileMap, metrics, filePath, exists) {
        const fileAndContent = exists
            ? await this.promiseToReadGraphQLFile(filePath)
            : null;
        const existingFile = graphQLFileMap.get(filePath);
        if (existingFile && !exists) {
            graphQLFileMap.delete(filePath);
        }
        else if (fileAndContent) {
            const graphQLFileInfo = { ...fileAndContent, ...metrics };
            graphQLFileMap.set(filePath, graphQLFileInfo);
        }
        return graphQLFileMap;
    }
    async updateFragmentDefinition(rootDir, filePath, contents) {
        const cache = this._fragmentDefinitionsCache.get(rootDir);
        const asts = contents.map(({ query }) => {
            try {
                return {
                    ast: parse(query, {
                        allowLegacySDLImplementsInterfaces: true,
                        allowLegacySDLEmptyFields: true,
                    }),
                    query,
                };
            }
            catch (error) {
                return { ast: null, query };
            }
        });
        if (cache) {
            cache.forEach((value, key) => {
                if (value.filePath === filePath) {
                    cache.delete(key);
                }
            });
            asts.forEach(({ ast, query }) => {
                if (!ast) {
                    return;
                }
                ast.definitions.forEach(definition => {
                    if (definition.kind === FRAGMENT_DEFINITION) {
                        cache.set(definition.name.value, {
                            filePath,
                            content: query,
                            definition,
                        });
                    }
                });
            });
        }
    }
    async updateFragmentDefinitionCache(rootDir, filePath, exists) {
        const fileAndContent = exists
            ? await this.promiseToReadGraphQLFile(filePath)
            : null;
        if (!exists) {
            const cache = this._fragmentDefinitionsCache.get(rootDir);
            if (cache) {
                cache.delete(filePath);
            }
        }
        else if (fileAndContent && fileAndContent.queries) {
            this.updateFragmentDefinition(rootDir, filePath, fileAndContent.queries);
        }
    }
    async updateObjectTypeDefinition(rootDir, filePath, contents) {
        const cache = this._typeDefinitionsCache.get(rootDir);
        const asts = contents.map(({ query }) => {
            try {
                return {
                    ast: parse(query, {
                        allowLegacySDLImplementsInterfaces: true,
                        allowLegacySDLEmptyFields: true,
                    }),
                    query,
                };
            }
            catch (error) {
                return { ast: null, query };
            }
        });
        if (cache) {
            cache.forEach((value, key) => {
                if (value.filePath === filePath) {
                    cache.delete(key);
                }
            });
            asts.forEach(({ ast, query }) => {
                if (!ast) {
                    return;
                }
                ast.definitions.forEach(definition => {
                    if (definition.kind === OBJECT_TYPE_DEFINITION ||
                        definition.kind === INPUT_OBJECT_TYPE_DEFINITION ||
                        definition.kind === ENUM_TYPE_DEFINITION) {
                        cache.set(definition.name.value, {
                            filePath,
                            content: query,
                            definition,
                        });
                    }
                });
            });
        }
    }
    async updateObjectTypeDefinitionCache(rootDir, filePath, exists) {
        const fileAndContent = exists
            ? await this.promiseToReadGraphQLFile(filePath)
            : null;
        if (!exists) {
            const cache = this._typeDefinitionsCache.get(rootDir);
            if (cache) {
                cache.delete(filePath);
            }
        }
        else if (fileAndContent && fileAndContent.queries) {
            this.updateObjectTypeDefinition(rootDir, filePath, fileAndContent.queries);
        }
    }
    _extendSchema(schema, schemaPath, schemaCacheKey) {
        const graphQLFileMap = this._graphQLFileListCache.get(this._configDir);
        const typeExtensions = [];
        if (!graphQLFileMap) {
            return schema;
        }
        graphQLFileMap.forEach(({ filePath, asts }) => {
            asts.forEach(ast => {
                if (filePath === schemaPath) {
                    return;
                }
                ast.definitions.forEach(definition => {
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
                            typeExtensions.push(definition);
                            break;
                    }
                });
            });
        });
        if (schemaCacheKey) {
            const sorted = typeExtensions.sort((a, b) => {
                const aName = a.definition ? a.definition.name.value : a.name.value;
                const bName = b.definition ? b.definition.name.value : b.name.value;
                return aName > bName ? 1 : -1;
            });
            const hash = stringToHash(JSON.stringify(sorted));
            if (this._typeExtensionMap.has(schemaCacheKey) &&
                this._typeExtensionMap.get(schemaCacheKey) === hash) {
                return schema;
            }
            this._typeExtensionMap.set(schemaCacheKey, hash);
        }
        return extendSchema(schema, {
            kind: DOCUMENT,
            definitions: typeExtensions,
        });
    }
    _invalidateSchemaCacheForProject(projectConfig) {
        const schemaKey = this._getSchemaCacheKeyForProject(projectConfig);
        schemaKey && this._schemaMap.delete(schemaKey);
    }
    _getSchemaCacheKeyForProject(projectConfig) {
        return projectConfig.schema;
    }
    _getProjectName(projectConfig) {
        return projectConfig;
    }
}
//# sourceMappingURL=GraphQLCache.js.map