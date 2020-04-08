// Deno.copyFileSync('./src/plugins/prettier.monaco.worker.ts', './plugins/prettier.monaco.worker.ts');
const text = new TextDecoder().decode(Deno.readFileSync('./src/plugins/prettier.monaco.worker.ts'));

Deno.writeFile('./plugins/prettier.monaco.worker.ts', new TextEncoder().encode(text.replace('../worker', "next-monaco-editor/worker").replace('../api', "next-monaco-editor/api")));
