import { Position, Range } from 'graphql-language-service-utils';
import { parse } from '@babel/parser';
const PARSER_OPTIONS = {
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    sourceType: 'module',
    strictMode: false,
};
const CREATE_CONTAINER_FUNCTIONS = {
    createFragmentContainer: true,
    createPaginationContainer: true,
    createRefetchContainer: true,
};
const DEFAULT_STABLE_TAGS = ['graphql', 'gql'];
export const DEFAULT_TAGS = [...DEFAULT_STABLE_TAGS, 'graphql.experimental'];
const BABEL_PLUGINS = [
    'jsx',
    'doExpressions',
    'objectRestSpread',
    ['decorators', { decoratorsBeforeExport: false }],
    'classProperties',
    'classPrivateProperties',
    'classPrivateMethods',
    'exportDefaultFrom',
    'exportNamespaceFrom',
    'asyncGenerators',
    'functionBind',
    'functionSent',
    'dynamicImport',
    'numericSeparator',
    'optionalChaining',
    'importMeta',
    'bigInt',
    'optionalCatchBinding',
    'throwExpressions',
    ['pipelineOperator', { proposal: 'minimal' }],
    'nullishCoalescingOperator',
];
export function findGraphQLTags(text, ext) {
    const result = [];
    const plugins = BABEL_PLUGINS.slice(0, BABEL_PLUGINS.length);
    if (ext === '.ts' || ext === '.tsx') {
        plugins?.push('typescript');
    }
    else {
        plugins?.push('flow', 'flowComments');
    }
    PARSER_OPTIONS.plugins = plugins;
    const ast = parse(text, PARSER_OPTIONS);
    const visitors = {
        CallExpression: (node) => {
            if ('callee' in node) {
                const callee = node.callee;
                if (!((callee.type === 'Identifier' &&
                    CREATE_CONTAINER_FUNCTIONS[callee.name]) ||
                    (callee.kind === 'MemberExpression' &&
                        callee.object.type === 'Identifier' &&
                        callee.object.value === 'Relay' &&
                        callee.property.type === 'Identifier' &&
                        CREATE_CONTAINER_FUNCTIONS[callee.property.name]))) {
                    traverse(node, visitors);
                    return;
                }
                if ('arguments' in node) {
                    const fragments = node.arguments[1];
                    if (fragments.type === 'ObjectExpression') {
                        fragments.properties.forEach((property) => {
                            if ('value' in property &&
                                'loc' in property.value &&
                                'tag' in property.value) {
                                const tagName = getGraphQLTagName(property.value.tag);
                                const template = getGraphQLText(property.value.quasi);
                                if (tagName && property.value.loc) {
                                    const loc = property.value.loc;
                                    const range = new Range(new Position(loc.start.line - 1, loc.start.column), new Position(loc.end.line - 1, loc.end.column));
                                    result.push({
                                        tag: tagName,
                                        template,
                                        range,
                                    });
                                }
                            }
                        });
                    }
                    else if ('tag' in fragments) {
                        const tagName = getGraphQLTagName(fragments.tag);
                        const template = getGraphQLText(fragments.quasi);
                        if (tagName && fragments.loc) {
                            const loc = fragments.loc;
                            const range = new Range(new Position(loc.start.line - 1, loc.start.column), new Position(loc.end.line - 1, loc.end.column));
                            result.push({
                                tag: tagName,
                                template,
                                range,
                            });
                        }
                    }
                    for (let ii = 2; ii < node.arguments.length; ii++) {
                        visit(node.arguments[ii], visitors);
                    }
                }
            }
        },
        TaggedTemplateExpression: (node) => {
            const tagName = getGraphQLTagName(node.tag);
            if (tagName) {
                const loc = node.quasi.quasis[0].loc;
                if (loc) {
                    const range = new Range(new Position(loc.start.line - 1, loc.start.column), new Position(loc.end.line - 1, loc.end.column));
                    result.push({
                        tag: tagName,
                        template: node.quasi.quasis[0].value.raw,
                        range,
                    });
                }
            }
        },
    };
    visit(ast, visitors);
    return result;
}
const IGNORED_KEYS = {
    comments: true,
    end: true,
    leadingComments: true,
    loc: true,
    name: true,
    start: true,
    trailingComments: true,
    type: true,
};
function getGraphQLTagName(tag) {
    if (tag.type === 'Identifier' &&
        DEFAULT_STABLE_TAGS.some(t => t === tag.name)) {
        return tag.name;
    }
    else if (tag.type === 'MemberExpression' &&
        tag.object.type === 'Identifier' &&
        tag.object.name === 'graphql' &&
        tag.property.type === 'Identifier' &&
        tag.property.name === 'experimental') {
        return 'graphql.experimental';
    }
    return null;
}
function getGraphQLText(quasi) {
    const quasis = quasi.quasis;
    return quasis[0].value.raw;
}
function visit(node, visitors) {
    const fn = visitors[node.type];
    if (fn && fn != null) {
        fn(node);
        return;
    }
    traverse(node, visitors);
}
function traverse(node, visitors) {
    for (const key in node) {
        if (IGNORED_KEYS[key]) {
            continue;
        }
        const prop = node[key];
        if (prop && typeof prop === 'object' && typeof prop.type === 'string') {
            visit(prop, visitors);
        }
        else if (Array.isArray(prop)) {
            prop.forEach(item => {
                if (item && typeof item === 'object' && typeof item.type === 'string') {
                    visit(item, visitors);
                }
            });
        }
    }
}
//# sourceMappingURL=findGraphQLTags.js.map