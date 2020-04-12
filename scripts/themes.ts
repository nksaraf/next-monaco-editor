import { readJsonSync, expandGlobSync , ensureDirSync, writeFileStr} from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

ensureDirSync('./src/themes')

const json: any = readJsonSync(path.join("./node_modules/monaco-themes/themes", "themelist.json"));
const themes: any = {};
for (var key in json) {
  themes[key] = readJsonSync(path.join("./node_modules/monaco-themes/themes", json[key] + '.json'))
}

var content = `
import monaco from '../api';

export interface AllThemes {
  ${Object.keys(themes).map(theme => `'${theme}': monaco.editor.IStandaloneThemeData;`).join('\n  ')}
}

export const allThemes: AllThemes = JSON.parse('${JSON.stringify(themes)}');
export default allThemes;
`;

writeFileStr(path.join('./src/themes', 'all.ts'), content);