import { ValidationRule, DocumentNode, GraphQLError, GraphQLSchema } from 'lib/plugins/graphql/language-service/graphql-language-service-utils/src/node_modules/graphql';
export declare function validateWithCustomRules(schema: GraphQLSchema, ast: DocumentNode, customRules?: Array<ValidationRule> | null, isRelayCompatMode?: boolean): Array<GraphQLError>;
//# sourceMappingURL=validateWithCustomRules.d.ts.map