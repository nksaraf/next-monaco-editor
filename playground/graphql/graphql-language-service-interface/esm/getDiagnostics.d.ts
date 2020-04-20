import { DocumentNode, GraphQLSchema, SourceLocation, ValidationRule } from 'graphql';
import { Range } from 'graphql-language-service-utils';
import { DiagnosticSeverity, Diagnostic } from 'vscode-languageserver-types';
export declare type SeverityLabels = 'Error' | 'Warning' | 'Information' | 'Hint';
export declare const DIAGNOSTIC_SEVERITY: {
    [key: string]: DiagnosticSeverity;
};
export declare function getDiagnostics(query: string, schema?: GraphQLSchema | null | undefined, customRules?: Array<ValidationRule>, isRelayCompatMode?: boolean): Array<Diagnostic>;
export declare function validateQuery(ast: DocumentNode, schema?: GraphQLSchema | null | undefined, customRules?: Array<ValidationRule> | null, isRelayCompatMode?: boolean): Array<Diagnostic>;
export declare function getTokenRange(location: SourceLocation, queryText: string): Range;
export declare function getRange(location: SourceLocation, queryText: string): Range;
//# sourceMappingURL=getDiagnostics.d.ts.map