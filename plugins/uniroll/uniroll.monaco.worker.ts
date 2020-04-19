// @ts-ignore
import { compile } from 'uniroll';
import {
  BaseWorker,
  initialize,
  IWorkerContext,
} from 'next-monaco-editor/worker';

// declare global {
//   // const prettier: any
//   const prettierPlugins: any
// }

class UnirollWorker extends BaseWorker {
  options: any;
  constructor(ctx: IWorkerContext<undefined>, config: any) {
    super(ctx, config);
    this.options = config;
  }

  async doSomething() {
    try {

      const files = {
        '/foo.tsx': 'export default 1',
        '/index.tsx': "import foo from 'foo';\nconsole.log('hello', foo)",
      };
      const bundle = await compile({
        useInMemory: true,
        files,
        input: '/index.tsx',
      });
      console.log(await bundle.generate({ format: 'esm' }));
    } catch (e) {
    }
  }
}

initialize(UnirollWorker);
