import { Kind, parse, visit, } from 'graphql';
import { offsetToPosition } from 'graphql-language-service-utils';
const { INLINE_FRAGMENT } = Kind;
const OUTLINEABLE_KINDS = {
    Field: true,
    OperationDefinition: true,
    Document: true,
    SelectionSet: true,
    Name: true,
    FragmentDefinition: true,
    FragmentSpread: true,
    InlineFragment: true,
    ObjectTypeDefinition: true,
    InputObjectTypeDefinition: true,
    InterfaceTypeDefinition: true,
    EnumTypeDefinition: true,
    EnumValueDefinition: true,
    InputValueDefinition: true,
    FieldDefinition: true,
};
export function getOutline(documentText) {
    let ast;
    try {
        ast = parse(documentText);
    }
    catch (error) {
        return null;
    }
    const visitorFns = outlineTreeConverter(documentText);
    const outlineTrees = visit(ast, {
        leave(node) {
            if (visitorFns !== undefined && node.kind in visitorFns) {
                return visitorFns[node.kind](node);
            }
            return null;
        },
    });
    return { outlineTrees };
}
function outlineTreeConverter(docText) {
    const meta = (node) => {
        return {
            representativeName: node.name,
            startPosition: offsetToPosition(docText, node.loc.start),
            endPosition: offsetToPosition(docText, node.loc.end),
            kind: node.kind,
            children: node.selectionSet || node.fields || node.values || node.arguments || [],
        };
    };
    return {
        Field: (node) => {
            const tokenizedText = node.alias
                ? [buildToken('plain', node.alias), buildToken('plain', ': ')]
                : [];
            tokenizedText.push(buildToken('plain', node.name));
            return { tokenizedText, ...meta(node) };
        },
        OperationDefinition: (node) => ({
            tokenizedText: [
                buildToken('keyword', node.operation),
                buildToken('whitespace', ' '),
                buildToken('class-name', node.name),
            ],
            ...meta(node),
        }),
        Document: (node) => node.definitions,
        SelectionSet: (node) => concatMap(node.selections, (child) => {
            return child.kind === INLINE_FRAGMENT ? child.selectionSet : child;
        }),
        Name: (node) => node.value,
        FragmentDefinition: (node) => ({
            tokenizedText: [
                buildToken('keyword', 'fragment'),
                buildToken('whitespace', ' '),
                buildToken('class-name', node.name),
            ],
            ...meta(node),
        }),
        InterfaceTypeDefinition: (node) => ({
            tokenizedText: [
                buildToken('keyword', 'interface'),
                buildToken('whitespace', ' '),
                buildToken('class-name', node.name),
            ],
            ...meta(node),
        }),
        EnumTypeDefinition: (node) => ({
            tokenizedText: [
                buildToken('keyword', 'enum'),
                buildToken('whitespace', ' '),
                buildToken('class-name', node.name),
            ],
            ...meta(node),
        }),
        EnumValueDefinition: (node) => ({
            tokenizedText: [buildToken('plain', node.name)],
            ...meta(node),
        }),
        ObjectTypeDefinition: (node) => ({
            tokenizedText: [
                buildToken('keyword', 'type'),
                buildToken('whitespace', ' '),
                buildToken('class-name', node.name),
            ],
            ...meta(node),
        }),
        InputObjectTypeDefinition: (node) => ({
            tokenizedText: [
                buildToken('keyword', 'input'),
                buildToken('whitespace', ' '),
                buildToken('class-name', node.name),
            ],
            ...meta(node),
        }),
        FragmentSpread: (node) => ({
            tokenizedText: [
                buildToken('plain', '...'),
                buildToken('class-name', node.name),
            ],
            ...meta(node),
        }),
        InputValueDefinition: (node) => {
            return {
                tokenizedText: [buildToken('plain', node.name)],
                ...meta(node),
            };
        },
        FieldDefinition: (node) => {
            return {
                tokenizedText: [buildToken('plain', node.name)],
                ...meta(node),
            };
        },
        InlineFragment: (node) => node.selectionSet,
    };
}
function buildToken(kind, value) {
    return { kind, value };
}
function concatMap(arr, fn) {
    const res = [];
    for (let i = 0; i < arr.length; i++) {
        const x = fn(arr[i], i);
        if (Array.isArray(x)) {
            res.push(...x);
        }
        else {
            res.push(x);
        }
    }
    return res;
}
//# sourceMappingURL=getOutline.js.map