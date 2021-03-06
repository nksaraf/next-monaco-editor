import { _Kind } from 'plugins/graphql/language-service/graphql-language-service-parser/src/node_modules/graphql/language/kinds';
import { Maybe } from 'plugins/graphql/language-service/graphql-language-service-parser/src/node_modules/graphql-language-service-types';
import CharacterStream from '../src/CharacterStream';
export declare type ContextToken = {
    start: number;
    end: number;
    string: string;
    state: State;
    style: string;
};
export declare type ContextTokenForCodeMirror = {
    start: number;
    end: number;
    string: string;
    type: string | null;
    state: State;
};
export declare type ContextTokenUnion = ContextToken | ContextTokenForCodeMirror;
export declare type RuleOrString = Rule | string;
export declare type ParseRule = RuleOrString[] | ((token: Token, stream: CharacterStream) => string | null | void);
export declare type Token = {
    kind: string;
    value: string;
};
export declare type Rule = {
    style?: string;
    match?: (token: Token) => boolean;
    update?: (state: State, token: Token) => void;
    separator?: string | Rule;
    isList?: boolean;
    ofRule?: Rule | string;
};
export declare type State = {
    level: number;
    levels?: number[];
    prevState: Maybe<State>;
    rule: Maybe<ParseRule>;
    kind: Maybe<RuleKind>;
    name: Maybe<string>;
    type: Maybe<string>;
    step: number;
    needsSeperator: boolean;
    needsAdvance?: boolean;
    indentLevel?: number;
};
export declare const AdditionalRuleKinds: _AdditionalRuleKinds;
export declare type _AdditionalRuleKinds = {
    ALIASED_FIELD: 'AliasedField';
    ARGUMENTS: 'Arguments';
    SHORT_QUERY: 'ShortQuery';
    QUERY: 'Query';
    MUTATION: 'Mutation';
    SUBSCRIPTION: 'Subscription';
    TYPE_CONDITION: 'TypeCondition';
    INVALID: 'Invalid';
    COMMENT: 'Comment';
    SCHEMA_DEF: 'SchemaDef';
    SCALAR_DEF: 'ScalarDef';
    OBJECT_TYPE_DEF: 'ObjectTypeDef';
    INTERFACE_DEF: 'InterfaceDef';
    UNION_DEF: 'UnionDef';
    ENUM_DEF: 'EnumDef';
    FIELD_DEF: 'FieldDef';
    INPUT_DEF: 'InputDef';
    INPUT_VALUE_DEF: 'InputValueDef';
    ARGUMENTS_DEF: 'ArgumentsDef';
    EXTEND_DEF: 'ExtendDef';
    DIRECTIVE_DEF: 'DirectiveDef';
};
export declare const RuleKinds: {
    ALIASED_FIELD: "AliasedField";
    ARGUMENTS: "Arguments";
    SHORT_QUERY: "ShortQuery";
    QUERY: "Query";
    MUTATION: "Mutation";
    SUBSCRIPTION: "Subscription";
    TYPE_CONDITION: "TypeCondition";
    INVALID: "Invalid";
    COMMENT: "Comment";
    SCHEMA_DEF: "SchemaDef";
    SCALAR_DEF: "ScalarDef";
    OBJECT_TYPE_DEF: "ObjectTypeDef";
    INTERFACE_DEF: "InterfaceDef";
    UNION_DEF: "UnionDef";
    ENUM_DEF: "EnumDef";
    FIELD_DEF: "FieldDef";
    INPUT_DEF: "InputDef";
    INPUT_VALUE_DEF: "InputValueDef";
    ARGUMENTS_DEF: "ArgumentsDef";
    EXTEND_DEF: "ExtendDef";
    DIRECTIVE_DEF: "DirectiveDef";
    NAME: "Name";
    DOCUMENT: "Document";
    OPERATION_DEFINITION: "OperationDefinition";
    VARIABLE_DEFINITION: "VariableDefinition";
    SELECTION_SET: "SelectionSet";
    FIELD: "Field";
    ARGUMENT: "Argument";
    FRAGMENT_SPREAD: "FragmentSpread";
    INLINE_FRAGMENT: "InlineFragment";
    FRAGMENT_DEFINITION: "FragmentDefinition";
    VARIABLE: "Variable";
    INT: "IntValue";
    FLOAT: "FloatValue";
    STRING: "StringValue";
    BOOLEAN: "BooleanValue";
    NULL: "NullValue";
    ENUM: "EnumValue";
    LIST: "ListValue";
    OBJECT: "ObjectValue";
    OBJECT_FIELD: "ObjectField";
    DIRECTIVE: "Directive";
    NAMED_TYPE: "NamedType";
    LIST_TYPE: "ListType";
    NON_NULL_TYPE: "NonNullType";
    SCHEMA_DEFINITION: "SchemaDefinition";
    OPERATION_TYPE_DEFINITION: "OperationTypeDefinition";
    SCALAR_TYPE_DEFINITION: "ScalarTypeDefinition";
    OBJECT_TYPE_DEFINITION: "ObjectTypeDefinition";
    FIELD_DEFINITION: "FieldDefinition";
    INPUT_VALUE_DEFINITION: "InputValueDefinition";
    INTERFACE_TYPE_DEFINITION: "InterfaceTypeDefinition";
    UNION_TYPE_DEFINITION: "UnionTypeDefinition";
    ENUM_TYPE_DEFINITION: "EnumTypeDefinition";
    ENUM_VALUE_DEFINITION: "EnumValueDefinition";
    INPUT_OBJECT_TYPE_DEFINITION: "InputObjectTypeDefinition";
    DIRECTIVE_DEFINITION: "DirectiveDefinition";
    SCHEMA_EXTENSION: "SchemaExtension";
    SCALAR_TYPE_EXTENSION: "ScalarTypeExtension";
    OBJECT_TYPE_EXTENSION: "ObjectTypeExtension";
    INTERFACE_TYPE_EXTENSION: "InterfaceTypeExtension";
    UNION_TYPE_EXTENSION: "UnionTypeExtension";
    ENUM_TYPE_EXTENSION: "EnumTypeExtension";
    INPUT_OBJECT_TYPE_EXTENSION: "InputObjectTypeExtension";
};
export declare type _RuleKinds = _Kind & typeof AdditionalRuleKinds;
export declare type RuleKind = _RuleKinds[keyof _RuleKinds];
export declare type RuleKindEnum = RuleKind;
export declare type TokenPattern = string | ((char: string) => boolean) | RegExp;
export interface CharacterStreamInterface {
    getStartOfToken: () => number;
    getCurrentPosition: () => number;
    eol: () => boolean;
    sol: () => boolean;
    peek: () => string | null;
    next: () => string;
    eat: (pattern: TokenPattern) => string | undefined;
    eatWhile: (match: TokenPattern) => boolean;
    eatSpace: () => boolean;
    skipToEnd: () => void;
    skipTo: (position: number) => void;
    match: (pattern: TokenPattern, consume?: Maybe<boolean>, caseFold?: Maybe<boolean>) => string[] | boolean;
    backUp: (num: number) => void;
    column: () => number;
    indentation: () => number;
    current: () => string;
}
//# sourceMappingURL=types.d.ts.map