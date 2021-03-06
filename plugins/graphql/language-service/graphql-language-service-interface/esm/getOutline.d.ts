import { Outline } from 'graphql-language-service-types';
declare const OUTLINEABLE_KINDS: {
    Field: boolean;
    OperationDefinition: boolean;
    Document: boolean;
    SelectionSet: boolean;
    Name: boolean;
    FragmentDefinition: boolean;
    FragmentSpread: boolean;
    InlineFragment: boolean;
    ObjectTypeDefinition: boolean;
    InputObjectTypeDefinition: boolean;
    InterfaceTypeDefinition: boolean;
    EnumTypeDefinition: boolean;
    EnumValueDefinition: boolean;
    InputValueDefinition: boolean;
    FieldDefinition: boolean;
};
export declare type OutlineableKinds = keyof typeof OUTLINEABLE_KINDS;
export declare function getOutline(documentText: string): Outline | null;
export {};
//# sourceMappingURL=getOutline.d.ts.map