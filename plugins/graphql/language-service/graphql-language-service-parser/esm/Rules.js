import { opt, list, butNot, t, p } from './RuleHelpers';
export const isIgnored = (ch) => ch === ' ' ||
    ch === '\t' ||
    ch === ',' ||
    ch === '\n' ||
    ch === '\r' ||
    ch === '\uFEFF' ||
    ch === '\u00A0';
export const LexRules = {
    Name: /^[_A-Za-z][_0-9A-Za-z]*/,
    Punctuation: /^(?:!|\$|\(|\)|\.\.\.|:|=|@|\[|]|\{|\||\})/,
    Number: /^-?(?:0|(?:[1-9][0-9]*))(?:\.[0-9]*)?(?:[eE][+-]?[0-9]+)?/,
    String: /^(?:"""(?:\\"""|[^"]|"[^"]|""[^"])*(?:""")?|"(?:[^"\\]|\\(?:"|\/|\\|b|f|n|r|t|u[0-9a-fA-F]{4}))*"?)/,
    Comment: /^#.*/,
};
export const ParseRules = {
    Document: [list('Definition')],
    Definition(token) {
        switch (token.value) {
            case '{':
                return 'ShortQuery';
            case 'query':
                return 'Query';
            case 'mutation':
                return 'Mutation';
            case 'subscription':
                return 'Subscription';
            case 'fragment':
                return 'FragmentDefinition';
            case 'schema':
                return 'SchemaDef';
            case 'scalar':
                return 'ScalarDef';
            case 'type':
                return 'ObjectTypeDef';
            case 'interface':
                return 'InterfaceDef';
            case 'union':
                return 'UnionDef';
            case 'enum':
                return 'EnumDef';
            case 'input':
                return 'InputDef';
            case 'extend':
                return 'ExtendDef';
            case 'directive':
                return 'DirectiveDef';
        }
    },
    ShortQuery: ['SelectionSet'],
    Query: [
        word('query'),
        opt(name('def')),
        opt('VariableDefinitions'),
        list('Directive'),
        'SelectionSet',
    ],
    Mutation: [
        word('mutation'),
        opt(name('def')),
        opt('VariableDefinitions'),
        list('Directive'),
        'SelectionSet',
    ],
    Subscription: [
        word('subscription'),
        opt(name('def')),
        opt('VariableDefinitions'),
        list('Directive'),
        'SelectionSet',
    ],
    VariableDefinitions: [p('('), list('VariableDefinition'), p(')')],
    VariableDefinition: ['Variable', p(':'), 'Type', opt('DefaultValue')],
    Variable: [p('$', 'variable'), name('variable')],
    DefaultValue: [p('='), 'Value'],
    SelectionSet: [p('{'), list('Selection'), p('}')],
    Selection(token, stream) {
        return token.value === '...'
            ? stream.match(/[\s\u00a0,]*(on\b|@|{)/, false)
                ? 'InlineFragment'
                : 'FragmentSpread'
            : stream.match(/[\s\u00a0,]*:/, false)
                ? 'AliasedField'
                : 'Field';
    },
    AliasedField: [
        name('property'),
        p(':'),
        name('qualifier'),
        opt('Arguments'),
        list('Directive'),
        opt('SelectionSet'),
    ],
    Field: [
        name('property'),
        opt('Arguments'),
        list('Directive'),
        opt('SelectionSet'),
    ],
    Arguments: [p('('), list('Argument'), p(')')],
    Argument: [name('attribute'), p(':'), 'Value'],
    FragmentSpread: [p('...'), name('def'), list('Directive')],
    InlineFragment: [
        p('...'),
        opt('TypeCondition'),
        list('Directive'),
        'SelectionSet',
    ],
    FragmentDefinition: [
        word('fragment'),
        opt(butNot(name('def'), [word('on')])),
        'TypeCondition',
        list('Directive'),
        'SelectionSet',
    ],
    TypeCondition: [word('on'), 'NamedType'],
    Value(token) {
        switch (token.kind) {
            case 'Number':
                return 'NumberValue';
            case 'String':
                return 'StringValue';
            case 'Punctuation':
                switch (token.value) {
                    case '[':
                        return 'ListValue';
                    case '{':
                        return 'ObjectValue';
                    case '$':
                        return 'Variable';
                }
                return null;
            case 'Name':
                switch (token.value) {
                    case 'true':
                    case 'false':
                        return 'BooleanValue';
                }
                if (token.value === 'null') {
                    return 'NullValue';
                }
                return 'EnumValue';
        }
    },
    NumberValue: [t('Number', 'number')],
    StringValue: [t('String', 'string')],
    BooleanValue: [t('Name', 'builtin')],
    NullValue: [t('Name', 'keyword')],
    EnumValue: [name('string-2')],
    ListValue: [p('['), list('Value'), p(']')],
    ObjectValue: [p('{'), list('ObjectField'), p('}')],
    ObjectField: [name('attribute'), p(':'), 'Value'],
    Type(token) {
        return token.value === '[' ? 'ListType' : 'NonNullType';
    },
    ListType: [p('['), 'Type', p(']'), opt(p('!'))],
    NonNullType: ['NamedType', opt(p('!'))],
    NamedType: [type('atom')],
    Directive: [p('@', 'meta'), name('meta'), opt('Arguments')],
    SchemaDef: [
        word('schema'),
        list('Directive'),
        p('{'),
        list('OperationTypeDef'),
        p('}'),
    ],
    OperationTypeDef: [name('keyword'), p(':'), name('atom')],
    ScalarDef: [word('scalar'), name('atom'), list('Directive')],
    ObjectTypeDef: [
        word('type'),
        name('atom'),
        opt('Implements'),
        list('Directive'),
        p('{'),
        list('FieldDef'),
        p('}'),
    ],
    Implements: [word('implements'), list('NamedType')],
    FieldDef: [
        name('property'),
        opt('ArgumentsDef'),
        p(':'),
        'Type',
        list('Directive'),
    ],
    ArgumentsDef: [p('('), list('InputValueDef'), p(')')],
    InputValueDef: [
        name('attribute'),
        p(':'),
        'Type',
        opt('DefaultValue'),
        list('Directive'),
    ],
    InterfaceDef: [
        word('interface'),
        name('atom'),
        list('Directive'),
        p('{'),
        list('FieldDef'),
        p('}'),
    ],
    UnionDef: [
        word('union'),
        name('atom'),
        list('Directive'),
        p('='),
        list('UnionMember', p('|')),
    ],
    UnionMember: ['NamedType'],
    EnumDef: [
        word('enum'),
        name('atom'),
        list('Directive'),
        p('{'),
        list('EnumValueDef'),
        p('}'),
    ],
    EnumValueDef: [name('string-2'), list('Directive')],
    InputDef: [
        word('input'),
        name('atom'),
        list('Directive'),
        p('{'),
        list('InputValueDef'),
        p('}'),
    ],
    ExtendDef: [word('extend'), 'ObjectTypeDef'],
    DirectiveDef: [
        word('directive'),
        p('@', 'meta'),
        name('meta'),
        opt('ArgumentsDef'),
        word('on'),
        list('DirectiveLocation', p('|')),
    ],
    DirectiveLocation: [name('string-2')],
};
function word(value) {
    return {
        style: 'keyword',
        match: (token) => token.kind === 'Name' && token.value === value,
    };
}
function name(style) {
    return {
        style,
        match: (token) => token.kind === 'Name',
        update(state, token) {
            state.name = token.value;
        },
    };
}
function type(style) {
    return {
        style,
        match: (token) => token.kind === 'Name',
        update(state, token) {
            if (state.prevState && state.prevState.prevState) {
                state.name = token.value;
                state.prevState.prevState.type = token.value;
            }
        },
    };
}
//# sourceMappingURL=Rules.js.map