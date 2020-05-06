// @ts-ignore
import { BaseWorker, initialize, IWorkerContext } from '@worker';

// declare global {
//   // const prettier: any
//   const prettierPlugins: any
// }
import scopeEval from 'scope-eval';
import { Client, query, Expr } from 'faunadb';

const transform = (code: string) => {
  return `(async function() {
    const client = new Client({
      secret: "fnADlqhXNYACEk3cEXoaPlrwxncM-sUFKbHKkXHj"
    });

    return await client.query(${code});
  })()`;
};

class FaunaDBWorker extends BaseWorker {
  options: any;
  constructor(ctx: IWorkerContext<undefined>, config: any) {
    super(ctx, config);
    this.options = config;
  }

  async fetch(uri: string) {
    try {
      const result = await scopeEval(transform(this.getText(uri)), {
        Client,
        q: query,
      });

      const clean = (object: any): any => {
        if (object instanceof Expr) {
          return object.toString();
        }
        if (!(typeof object === 'object')) {
          return object;
        }

        if (Array.isArray(object)) {
          return object.map((val) => clean(val));
        }

        let other: any = {};
        Object.keys(object).forEach((key) => {
          other[key] = clean(object[key]);
        });
        return other;
      };

      const cleaned = clean(result);
      if (!(typeof cleaned === 'object')) {
        return { result: cleaned };
      } else {
        return cleaned;
      }
    } catch (e) {
      return e;
    }
  }
}

initialize(FaunaDBWorker);
