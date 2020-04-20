import { Kind } from 'graphql';
export const AdditionalRuleKinds = {
    ALIASED_FIELD: 'AliasedField',
    ARGUMENTS: 'Arguments',
    SHORT_QUERY: 'ShortQuery',
    QUERY: 'Query',
    MUTATION: 'Mutation',
    SUBSCRIPTION: 'Subscription',
    TYPE_CONDITION: 'TypeCondition',
    INVALID: 'Invalid',
    COMMENT: 'Comment',
    SCHEMA_DEF: 'SchemaDef',
    SCALAR_DEF: 'ScalarDef',
    OBJECT_TYPE_DEF: 'ObjectTypeDef',
    INTERFACE_DEF: 'InterfaceDef',
    UNION_DEF: 'UnionDef',
    ENUM_DEF: 'EnumDef',
    FIELD_DEF: 'FieldDef',
    INPUT_DEF: 'InputDef',
    INPUT_VALUE_DEF: 'InputValueDef',
    ARGUMENTS_DEF: 'ArgumentsDef',
    EXTEND_DEF: 'ExtendDef',
    DIRECTIVE_DEF: 'DirectiveDef',
};
export const RuleKinds = {
    ...Kind,
    ...AdditionalRuleKinds,
};
//# sourceMappingURL=types.js.map