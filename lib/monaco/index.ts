import * as monaco from 'monaco-editor';
import './worker-client';
import './languages';
import './editor';
import './plugin';

export { monaco };
export * from '../utils';
export default monaco;

// registerLanguage({
// 	id: 'typescript',
// 	extensions: ['.ts', '.tsx'],
// 	aliases: ['TypeScript', 'ts', 'typescript'],
// 	mimetypes: ['text/typescript'],
// 	loader: () => <Promise<any>>import('./typescript')
// });
