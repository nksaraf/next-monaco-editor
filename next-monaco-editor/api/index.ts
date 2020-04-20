import * as monaco from 'monaco-editor';
import './worker';
import './languages';
import './editor';

export { monaco };
export default monaco;

// registerLanguage({
// 	id: 'typescript',
// 	extensions: ['.ts', '.tsx'],
// 	aliases: ['TypeScript', 'ts', 'typescript'],
// 	mimetypes: ['text/typescript'],
// 	loader: () => <Promise<any>>import('./typescript')
// });
