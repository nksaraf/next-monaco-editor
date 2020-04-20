import monaco from 'monaco';

import {
  getTemplate,
  getMainFile,
} from 'codesandbox-import-utils/lib/create-sandbox/templates';

// import createSandbox from 'codesandbox-import-utils/lib/create-sandbox/index';

import { useDebouncedCallback } from 'use-debounce';
import { useFiles } from 'toolbox/useFiles';

import { dispatch, listen, registerFrame } from 'codesandbox-api';

export interface IManagerOptions {
  /**
   * Location of the bundler.
   */
  bundlerURL?: string;
  /**
   * Width of iframe.
   */
  width?: string;
  /**
   * Height of iframe.
   */
  height?: string;
  /**
   * If we should skip the third step: evaluation.
   */
  skipEval?: boolean;

  /**
   * You can pass a custom file resolver that is responsible for resolving files.
   * We will use this to get all files from the file system.
   */
  fileResolver?: {
    isFile: (path: string) => Promise<boolean>;
    readFile: (path: string) => Promise<string>;
  };
}

export interface IFile {
  code: string;
}

export interface IFiles {
  [path: string]: IFile;
}

export interface IModules {
  [path: string]: {
    code: string;
    path: string;
  };
}

export interface IDependencies {
  [depName: string]: string;
}

export interface ISandboxInfo {
  files: IFiles;
  dependencies?: IDependencies;
  entry?: string;
  /**
   * What template we use, if not defined we infer the template from the dependencies or files.
   *
   * @type {string}
   */
  template?: string;

  showOpenInCodeSandbox?: boolean;

  /**
   * Only use unpkg for fetching the dependencies, no preprocessing. It's slower, but doesn't talk
   * to AWS.
   */
  disableDependencyPreprocessing?: boolean;
}
// import { getTemplate } from 'codesandbox-utils';
// import { createHookContext } from './createHookContext';
// import { createPackageJSON } from './useSandbox';

export function prepareSandboxFiles(
  files: { [key: string]: { text: string } },
  dependencies: { [key: string]: string },
  entry: string
) {
  const newFiles = { ...files };

  if (!newFiles['/package.json']) {
    if (!dependencies) {
      throw new Error(
        'No dependencies specified, please specify either a package.json or dependencies.'
      );
    }

    if (!entry) {
      throw new Error(
        "No entry specified, please specify either a package.json with 'main' field or dependencies."
      );
    }

    newFiles['/package.json'] = {
      text: createPackageJSON(dependencies, entry),
    };
  }

  return newFiles;
}

export function createPackageJSON(
  dependencies = {},
  entry: string = '/index.js'
) {
  return JSON.stringify(
    {
      name: 'sandpack-project',
      main: entry,
      dependencies,
    },
    null,
    2
  );
}
import { createContext } from 'create-hook-context';

const [BundlerProvider, useBundler, withBundler] = createContext<
  {
    bundlerURL: string;
    fileResolver?: any;
    skipEval?: boolean;
    width?: number;
    height?: number;
  },
  any
>(function (bundlerOptions) {
  const [
    { bundlerURL, fileResolver, skipEval = false, width, height },
    setOptions,
  ] = React.useState(bundlerOptions);

  const updatePreview = React.useCallback(
    (sandboxInfo) => {
      const {
        files,
        showOpenInCodeSandbox = false,
        template,
        dependencies,
        entry,
      } = sandboxInfo;

      let packageJSON = JSON.parse(createPackageJSON(dependencies, entry));
      console.log(packageJSON);
      try {
        packageJSON = JSON.parse(files['/package.json'].text);
      } catch (e) {
        console.error('Could not parse package.json file: ' + e.message);
      }

      console.log(files);

      // console.log(createSandbox({}));

      files['/package.json'] = { text: JSON.stringify(packageJSON) };

      const modules = Object.keys(files).reduce(
        (prev, next) => ({
          ...prev,
          [next]: {
            code: files[next].text,
            path: next,
          },
        }),
        {}
      );
      // // TODO move this to a common format
      const normalizedModules = Object.keys(files).reduce(
        (prev, next) => ({
          ...prev,
          [next]: {
            content: files[next].text,
            path: next,
          },
        }),
        {}
      );

      dispatch({
        type: 'compile',
        codesandbox: true,
        version: 3,
        modules,
        externalResources: [],
        hasFileResolver: Boolean(fileResolver),
        disableDependencyPreprocessing: false,
        template: template || getTemplate({ dependencies }, normalizedModules),
        showOpenInCodeSandbox,
        skipEval,
      });
    },
    [skipEval, bundlerURL, fileResolver]
  );

  return { updatePreview, setOptions, bundlerURL, fileResolver };
});

const BUNDLER_URL = 'http://localhost:6969/index.html';
// export const SandpackIFrame = ({ ...props }) => {
//   const { bundlerURL } = useBundler();
//   const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

//   const handleMessage = React.useCallback(
//     (message: any) => {
//       if (message.type === 'initialized') {
//         if (iframeRef.current && iframeRef?.current?.contentWindow) {
//           registerFrame(iframeRef?.current?.contentWindow, bundlerURL);
//           // if (fileResolver) {
//           //   this.fileResolverProtocol = new Protocol(
//           //     "file-resolver",
//           //     async (data: { m: "isFile" | "readFile"; p: string }) => {
//           //       if (data.m === "isFile") {
//           //         return fileResolver!.isFile(data.p);
//           //       }
//           //       return fileResolver!.readFile(data.p);
//           //     },
//           //     iframe.current.contentWindow
//           //   );
//           // }
//         }
//       }
//     },
//     [iframeRef.current]
//   );

//   React.useEffect(() => {
//     const listener = listen(handleMessage);
//     return () => listener();
//   }, [handleMessage]);

//   return (
//     <iframe
//       ref={iframeRef}
//       title="sandpack-sandbox"
//       key={1}
//       border="none"
//       {...props}
//       // style={{
//       //   width: "100%",
//       //   height: "50%",
//       //   border: 0,
//       //   outline: 0
//       //   // position: "absolute"
//       //   // visibility: "hidden"
//       // }}
//       sandbox="allow-forms allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
//       src={bundlerURL}
//     />
//   );
// };

export default withBundler({ bundlerURL: BUNDLER_URL, skipEval: false }, () => {
  const { updatePreview } = useBundler();
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  const files = {
    '/index.js': 'ReactDOM.render()`',
  };
  const { filesRef, setFile } = useFiles(
    'faunadb',
    // {
    files
    //   '/index.ts': dedent`import { Client, query } from "faunadb"

    // var client = new Client({
    //   secret: "fnADlqhXNYACEk3cEXoaPlrwxncM-sUFKbHKkXHj"
    // })

    // var q = query;

    // console.log('hello')`,
    // },
  );

  React.useEffect(() => {
    const listener = listen(console.log);
    return () => {
      listener();
    };
  }, []);

  const [update] = useDebouncedCallback(
    () =>
      updatePreview({
        files: Object.fromEntries(
          Object.entries(filesRef.current).map(([file, text]) => [
            file,
            { text },
          ])
        ),
        // template: 'create-react-app',
        entry: '/index.js',
        dependencies: {
          faunadb: '2.13.0',
          uuid: 'latest',
          react: 'latest',
          'react-json-view': 'latest',
          'react-dom': 'latest',
        },
      }),
    500
  );

  const onChange = React.useCallback(
    (val: string) => {
      setFile('/index.js', val);
      update();
    },
    [setFile, update]
  );
});
