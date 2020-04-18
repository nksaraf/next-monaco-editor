// Deno.copyFileSync('./src/plugins/prettier.monaco.worker.ts', './plugins/prettier.monaco.worker.ts');
const text = new TextDecoder().decode(Deno.readFileSync('./next-monaco-editor/plugins/prettier.monaco.worker.ts'));

Deno.writeFile('./plugins/prettier.monaco.worker.ts', new TextEncoder().encode(text.replace('../worker', "next-monaco-editor/worker").replace('../api', "next-monaco-editor/api")));

// Deno.copyFileSync('./src/plugins/prettier.monaco.worker.ts', './plugins/prettier.monaco.worker.ts');
const css = new TextDecoder().decode(Deno.readFileSync('./next-monaco-editor/css/monaco.css'));

Deno.writeFile('./dist/monaco.css', new TextEncoder().encode(css));
