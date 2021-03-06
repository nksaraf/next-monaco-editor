import { locToRange, offsetToPosition } from 'graphql-language-service-utils';
import assert from 'assert';
export const LANGUAGE = 'GraphQL';
function getRange(text, node) {
    const location = node.loc;
    assert(location, 'Expected ASTNode to have a location.');
    return locToRange(text, location);
}
function getPosition(text, node) {
    const location = node.loc;
    assert(location, 'Expected ASTNode to have a location.');
    return offsetToPosition(text, location.start);
}
export async function getDefinitionQueryResultForNamedType(text, node, dependencies) {
    const name = node.name.value;
    const defNodes = dependencies.filter(({ definition }) => definition.name && definition.name.value === name);
    if (defNodes.length === 0) {
        throw Error(`Definition not found for GraphQL type ${name}`);
    }
    const definitions = defNodes.map(({ filePath, content, definition }) => getDefinitionForNodeDefinition(filePath || '', content, definition));
    return {
        definitions,
        queryRange: definitions.map(_ => getRange(text, node)),
    };
}
export async function getDefinitionQueryResultForFragmentSpread(text, fragment, dependencies) {
    const name = fragment.name.value;
    const defNodes = dependencies.filter(({ definition }) => definition.name.value === name);
    if (defNodes.length === 0) {
        throw Error(`Definition not found for GraphQL fragment ${name}`);
    }
    const definitions = defNodes.map(({ filePath, content, definition }) => getDefinitionForFragmentDefinition(filePath || '', content, definition));
    return {
        definitions,
        queryRange: definitions.map(_ => getRange(text, fragment)),
    };
}
export function getDefinitionQueryResultForDefinitionNode(path, text, definition) {
    return {
        definitions: [getDefinitionForFragmentDefinition(path, text, definition)],
        queryRange: definition.name ? [getRange(text, definition.name)] : [],
    };
}
function getDefinitionForFragmentDefinition(path, text, definition) {
    const name = definition.name;
    if (!name) {
        throw Error('Expected ASTNode to have a Name.');
    }
    return {
        path,
        position: getPosition(text, definition),
        range: getRange(text, definition),
        name: name.value || '',
        language: LANGUAGE,
        projectRoot: path,
    };
}
function getDefinitionForNodeDefinition(path, text, definition) {
    const name = definition.name;
    assert(name, 'Expected ASTNode to have a Name.');
    return {
        path,
        position: getPosition(text, definition),
        range: getRange(text, definition),
        name: name.value || '',
        language: LANGUAGE,
        projectRoot: path,
    };
}
//# sourceMappingURL=getDefinition.js.map