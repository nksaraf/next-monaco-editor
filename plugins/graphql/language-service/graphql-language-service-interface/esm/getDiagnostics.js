import invariant from 'assert';
import { findDeprecatedUsages, parse } from 'graphql';
import { CharacterStream, onlineParser } from 'graphql-language-service-parser';
import { Range, validateWithCustomRules, Position, } from 'graphql-language-service-utils';
export const DIAGNOSTIC_SEVERITY = {
    Error: 1,
    Warning: 2,
    Information: 3,
    Hint: 4,
};
export function getDiagnostics(query, schema = null, customRules, isRelayCompatMode) {
    let ast = null;
    try {
        ast = parse(query);
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
    return validateQuery(ast, schema, customRules, isRelayCompatMode);
}
export function validateQuery(ast, schema = null, customRules, isRelayCompatMode) {
    if (!schema) {
        return [];
    }
    const validationErrorAnnotations = mapCat(validateWithCustomRules(schema, ast, customRules, isRelayCompatMode), error => annotations(error, DIAGNOSTIC_SEVERITY.Error, 'Validation'));
    const deprecationWarningAnnotations = !findDeprecatedUsages
        ? []
        : mapCat(findDeprecatedUsages(schema, ast), error => annotations(error, DIAGNOSTIC_SEVERITY.Warning, 'Deprecation'));
    return validationErrorAnnotations.concat(deprecationWarningAnnotations);
}
function mapCat(array, mapper) {
    return Array.prototype.concat.apply([], array.map(mapper));
}
function annotations(error, severity, type) {
    if (!error.nodes) {
        return [];
    }
    const highlightedNodes = [];
    error.nodes.forEach(node => {
        const highlightNode = node.kind !== 'Variable' && 'name' in node
            ? node.name
            : 'variable' in node
                ? node.variable
                : node;
        if (highlightNode) {
            invariant(error.locations, 'GraphQL validation error requires locations.');
            const loc = error.locations[0];
            const highlightLoc = getLocation(highlightNode);
            const end = loc.column + (highlightLoc.end - highlightLoc.start);
            highlightedNodes.push({
                source: `GraphQL: ${type}`,
                message: error.message,
                severity,
                range: new Range(new Position(loc.line - 1, loc.column - 1), new Position(loc.line - 1, end)),
            });
        }
    });
    return highlightedNodes;
}
export function getTokenRange(location, queryText) {
    const parser = onlineParser();
    const state = parser.startState();
    const lines = queryText.split('\n');
    invariant(lines.length >= location.line, 'Query text must have more lines than where the error happened');
    let stream = null;
    for (let i = 0; i < location.line; i++) {
        stream = new CharacterStream(lines[i]);
        while (!stream.eol()) {
            parser.token(stream, state);
            if (i === location.line - 1 &&
                location.column - 1 >= stream._start &&
                location.column - 1 <= stream._pos) {
                return new Range(new Position(location.line - 1, stream._start), new Position(location.line - 1, stream._pos));
            }
        }
    }
    return new Range(new Position(location.line - 1, location.column - 1), new Position(location.line - 1, location.column - 1));
}
export function getRange(location, queryText) {
    const parser = onlineParser();
    const state = parser.startState();
    const lines = queryText.split('\n');
    invariant(lines.length >= location.line, 'Query text must have more lines than where the error happened');
    let stream = null;
    for (let i = 0; i < location.line; i++) {
        stream = new CharacterStream(lines[i]);
        while (!stream.eol()) {
            const style = parser.token(stream, state);
            if (style === 'invalidchar') {
                break;
            }
        }
    }
    invariant(stream, 'Expected Parser stream to be available.');
    const line = location.line - 1;
    const start = stream.getStartOfToken();
    const end = stream.getCurrentPosition();
    return new Range(new Position(line, start), new Position(line, end));
}
function getLocation(node) {
    const typeCastedNode = node;
    const location = typeCastedNode.loc;
    invariant(location, 'Expected ASTNode to have a location.');
    return location;
}
//# sourceMappingURL=getDiagnostics.js.map