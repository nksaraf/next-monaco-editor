import { Project, StructureKind, NamedExports } from "ts-morph";

// initialize
const project = new Project({
    // Optionally specify compiler options, tsconfig.json, in-memory file system, and more here.
    // If you initialize with a tsconfig.json, then it will automatically populate the project
    // with the associated source files.
    // Read more: https://ts-morph.com/setup/
});

// add source files
project.addSourceFilesAtPaths("node_modules/monaco-editor/esm/vs/editor/**/*.{d.ts,ts}");
const editorApi = project.getSourceFile(project.getSourceFiles()[0].getFilePath());

const language = editorApi.getNamespaces().find(n => n.getName() === 'languages');
const providers = language.getFunctions().filter(f => f.getName().startsWith('register') && f.getName() !== 'register');

// providers.forEach(provider => {
//   // console.log(provider.getName());
//   // console.log(provider.compilerNode.parameters[1].type.getText());

//   const providerInterface = language.getInterfaceOrThrow(provider.compilerNode.parameters[1].type.getText());
//   const decls = [];

//   providerInterface.getMethods().forEach(method => {
//     const name = method.getName();
//     if (name.startsWith('provide')) {
//       let providerName = name.slice(7);
//       providerName = providerName.charAt(0).toLowerCase() + providerName.slice(1);
//       decls.push(`${method.getName()}: getProvider(getWorker, '${providerName}')`)
//     }
//     if (name.startsWith('resolve')) {
//       let providerName = name.slice(7);
//       providerName = providerName.charAt(0).toLowerCase() + providerName.slice(1);
//       decls.push(`${method.getName()}: getResolver(getWorker, '${providerName}')`)
//     }
//   });

//   console.log(`monaco.languages.${provider.getName()}(languageId, {
//   ${decls.join(',\n')}
// });
// `)
// })

// const decls = [];

// providers.forEach(provider => {
//   // console.log(provider.getName());
//   // console.log(provider.compilerNode.parameters[1].type.getText());

//   const providerInterface = language.getInterfaceOrThrow(provider.compilerNode.parameters[1].type.getText());

//   providerInterface.getMethods().forEach(method => {
//     const name = method.getName();
//     const modelParam = method.getParameter('model');
//     if (!modelParam) {
//       // console.log(name);
//       return;
//     }

//     const params = method.getParameters().slice(1);
//     const printedParams = [`model: IMirrorModel`, ...(params.filter(p => p.getName() !== 'token').map(p => {
//         return `${p.getName()}: ${p.getType().getText().replace(/import\(.*\)/, 'monaco')}`;
//     }))].join(', ')

//     const returnType = method.getReturnType().getText().replace(/import\([^\)]*\)/g, 'monaco');
//     if (name.startsWith('provide')) {
//       let providerName = name.slice(7);
//       providerName = providerName.charAt(0).toLowerCase() + providerName.slice(1);
//   // provideHover?(model: IMirrorModel, position: monaco.Position): ProviderResult<monaco.languages.Hover>;

//       decls.push(`${method.getName()}?(${printedParams}): ${returnType}`)
//     }
//     if (name.startsWith('resolve')) {
//       let providerName = name.slice(7);
//       providerName = providerName.charAt(0).toLowerCase() + providerName.slice(1);
//       decls.push(`${method.getName()}?(${printedParams}): ${returnType}`)
//     }
//   });

// })

// console.log(decls.join('\n'))