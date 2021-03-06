import { LexRules as LexRulesType, ParseRules as ParseRulesType } from '../src/Rules';
import CharacterStream from '../src/CharacterStream';
import { State } from '../src/types';
declare type ParserOptions = {
    eatWhitespace: (stream: CharacterStream) => boolean;
    lexRules: typeof LexRulesType;
    parseRules: typeof ParseRulesType;
    editorConfig: {
        [name: string]: any;
    };
};
export default function onlineParser(options?: ParserOptions): {
    startState: () => State;
    token: (stream: CharacterStream, state: State) => string;
};
export {};
//# sourceMappingURL=onlineParser.d.ts.map