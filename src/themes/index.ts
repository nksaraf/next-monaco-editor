import light from './light';
import dark from './dark';
import ocean from './ocean';
import { hc_black, vs, vs_dark } from 'monaco-editor/esm/vs/editor/standalone/common/themes';
import all from './monaco-themes';

const allThemes = {
  ocean: ocean,
  'ayu-light': light,
  'ayu-dark': dark,
  'vs': vs,
  'vs-dark': vs_dark,
  'hc-black': hc_black,
  ...all
};

export type ThemeNames = keyof typeof allThemes;
export default allThemes;

export const themeNames = {}

Object.keys(allThemes).forEach(theme => {
  themeNames[toTitleCase(theme)] = theme;
})

function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/(?:^|[\s])\w/g, function (match) {
      return match.toUpperCase();
    })
    .replace(' Theme', '');
}
