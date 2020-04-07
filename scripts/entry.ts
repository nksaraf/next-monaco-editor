import { ensureDirSync } from 'https://deno.land/std/fs/ensure_dir.ts';

const encoder = new TextEncoder();
ensureDirSync('./dist/' + Deno.args[0]);

const contents = `
'use strict'
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/production/index.js');
} else {
  module.exports = require('./cjs/development/index.js');
}
`;
Deno.writeFileSync(`./dist/${Deno.args[0]}/index.js`, encoder.encode(contents));
