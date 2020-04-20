import { TokenPattern, CharacterStreamInterface } from './types';
export default class CharacterStream implements CharacterStreamInterface {
    _start: number;
    _pos: number;
    _sourceText: string;
    constructor(sourceText: string);
    getStartOfToken: () => number;
    getCurrentPosition: () => number;
    _testNextCharacter(pattern: TokenPattern): boolean;
    eol: () => boolean;
    sol: () => boolean;
    peek: () => string | null;
    next: () => string;
    eat: (pattern: TokenPattern) => string | undefined;
    eatWhile: (match: TokenPattern) => boolean;
    eatSpace: () => boolean;
    skipToEnd: () => void;
    skipTo: (position: number) => void;
    match: (pattern: TokenPattern, consume?: import("graphql-language-service-types").Maybe<boolean>, caseFold?: import("graphql-language-service-types").Maybe<boolean>) => boolean | string[];
    backUp: (num: number) => void;
    column: () => number;
    indentation: () => number;
    current: () => string;
}
//# sourceMappingURL=CharacterStream.d.ts.map