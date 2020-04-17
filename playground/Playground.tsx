import React, { useState, useCallback } from 'react';
import Editor from 'next-monaco-editor';
import monaco from 'next-monaco-editor/api';
import registerGraphql from './monaco-graphql';
import { UrlLoader } from './monaco-graphql/LanguageService';
import { Global } from 'magic-components';
import dedent from 'dedent';
import Explorer from 'graphiql-explorer';
import { GraphQLSchema } from 'graphql';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'magic-components';
import { GraphQLogo } from './GraphQLogo';
import { Modal } from './Modal';
import YAML from 'yaml';
// import Split from 'react-split';

const ReactJSON = dynamic(() => import('react-json-view'), { ssr: false });
const Split = dynamic(() => import('react-split'), { ssr: false });

const MONO_FONTS = 'SFMono, SF Mono, Inconsolata, monospace';

const globalStyles: any = {
  body: { margin: 0 },
  '*': {
    boxSizing: 'border-box',
  },
  '.graphiql-explorer-root': {
    fontFamily: `${MONO_FONTS} !important`,
    px: '16px !important',
    py: '16px !important',
  },
  '.graphiql-explorer-root input': {
    fontSize: '12px',
    minWidth: '8ch !important',
    width: 'none !important',
  },
  '.graphiql-explorer-actions select': {
    marginLeft: 2,
  },
  '.doc-explorer-title-bar': {
    display: 'none !important',
  },
  '.gutter': {
    cursor: 'col-resize',
    backgroundColor: 'grey.200',
  },
  '.monaco-editor': {
    paddingTop: '12px',
  },
};

function useGraphQLSchema({ uri, headers }: any) {
  const [schema, setSchema] = React.useState<GraphQLSchema | null>(null);
  React.useEffect(() => {
    new UrlLoader()
      .load(uri, { headers })
      .then((r: { schema: GraphQLSchema | null }) => setSchema(r.schema));
  }, [uri]);
  return schema;
}

function useQueryText(
  editorRef?: any,
  initialValue?: string
): [string, React.Dispatch<React.SetStateAction<string>>] {
  // React.useEffect(() => {
  //   if (
  //     editorRef.current &&
  //     editorRef.current?.getModel()?.getValue() !== query
  //   ) {
  //     editorRef.current.pushUndoStop();
  //     const model = editorRef.current.getModel();
  //     if (!model) {
  //       return;
  //     }
  //     model.pushEditOperations(
  //       [],
  //       [
  //         {
  //           range: model.getFullModelRange(),
  //           text: query,
  //         },
  //       ],
  //       () => null
  //     );
  //     editorRef.current.pushUndoStop();
  //     editorRef.current.getModel()?.setValue(query);
  //   }
  // }, [query, editorRef.current]);
  return [query, setQuery];
}

// Hook
function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = React.useCallback(
    (value: T) => {
      try {
        setStoredValue((storedValue) => {
          // Allow value to be a function so we have same API as useState
          const valueToStore =
            value instanceof Function ? value(storedValue) : value;

          // Save to local storages
          window.localStorage.setItem(key, JSON.stringify(valueToStore));

          // Save state
          return valueToStore;
        });
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    },
    [setStoredValue]
  );

  return [storedValue, setValue as any];
}

export function Playground() {
  const [currentProject, setCurrentProject] = useLocalStorage(
    'current-project',
    'pokemon'
  );
  const [settings, setSettings] = useLocalStorage<{ [key: string]: any }>(
    'settings',
    {
      pokemon: {
        uri: 'https://graphql-pokemon.now.sh/',
        headers: {},
      },
    }
  );
  const schema = useGraphQLSchema(settings[currentProject]);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [query, setQuery] = useLocalStorage(
    'query',
    dedent`query MyQuery1 {

      }`
  );
  const [result, setResult] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [path, setPath] = React.useState('/query.graphql');
  const onSettingsChange = useCallback(
    (val) => {
      try {
        const sett = YAML.parse(val);
        setSettings(sett);
      } catch (e) {}
    },
    [setSettings]
  );

  const files = {
    '/query.graphql': query,
    '/settings.yaml': YAML.stringify(settings),
  };

  const onChange = path === '/settings.yaml' ? onSettingsChange : setQuery;

  async function executeCurrentOp(opname?: string) {
    // monaco.
    try {
      const operation = editorRef.current.getValue();
      // const variables = variablesEditor.getValue();
      const body: {
        variables?: string;
        query: string;
        operationName?: string;
      } = {
        query: operation,
        operationName: opname,
      };
      // const parsedVariables = JSON.parse(variables);
      // if (parsedVariables && Object.keys(parsedVariables).length) {
      //   body.variables = variables;
      // }
      const projSettings = settings[currentProject];
      const result = await fetch(projSettings.uri, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...projSettings.headers,
        },
        body: JSON.stringify(body),
      });
      const resultText = await result.text();
      setResult(JSON.parse(resultText));
    } catch (err) {
      setResult(err);
    }
  }

  return (
    <>
      <Global style={globalStyles} />
      <row
        as={Split}
        width="100vw"
        noMotion
        gap={0}
        maxHeight="100vh"
        sizes={[20, 45, 35]}
        direction="horizontal"
        onDrag={() => {
          editorRef.current?.layout();
        }}
      >
        <div height="100vh" overflow="scroll">
          <div>
            {schema && (
              <Explorer
                width="100%"
                query={query}
                // query={editorRef.current?.getModel()?.getValue()}
                onEdit={setQuery}
                // onEdit={editValue}
                explorerIsOpen={true}
                schema={schema}
              />
            )}
          </div>
        </div>
        <Editor
          onChange={onChange}
          files={files}
          height="100vh"
          path={path}
          language="graphql"
          style={{ overflow: 'hidden' }}
          editorWillMount={(monaco) => {
            monaco.languages.onLanguage('graphql', () =>
              console.log('graphqllll')
            );
            registerGraphql(monaco, settings[currentProject]);
          }}
          editorDidMount={(editor, monaco) => {
            const getOperationNames = async () => {
              const worker = await monaco.worker.get('graphql');
              // const typescript = await monaco.worker.get('typescript');
              const ast = await worker.getAST(
                editor.getModel()?.uri.toString()
              );
              const operations = ast.definitions.map((d: any) => d.name.value);
              return operations;
            };

            // editor.addAction({
            //   id: 'graphql.editSettings',
            //   label: 'Edit GraphQL Settings',
            //   contextMenuOrder: 1,
            //   contextMenuGroupId: 'graphql',
            //   run: async () => {
            //     console.log(editor.getModel());
            //     const settingsUri = monaco.Uri.file('settings.yaml');
            //     if (models[settingsUri.toString()]) {
            //       editor.setModel(models[settingsUri.toString()]);
            //     } else {
            //       const model = monaco.editor.createModel(
            //         YAML.stringify({ projects: settings }),
            //         'yaml',
            //         settingsUri
            //       );
            //       models[settingsUri.toString()] = model;
            //       editor.setModel(model);
            //     }
            //     editor;
            //     // console.log();
            //     // const operations = await getOperationNames();
            //     // if (operations.length > 1) {
            //     //   editor.trigger('graphql.run', 'graphql.selectOperation', {});
            //     // } else {
            //     //   executeCurrentOp(operations[0]);
            //     // }
            //   },
            // });

            editor.addSelectAction({
              id: 'graphql.selectOperation',
              label: 'Run GrapQL Operation by name',
              isSupported: () => true,
              alias: 'run operation',
              choices: getOperationNames,
              runChoice: function (value, mode) {
                if (mode === 1) executeCurrentOp(value);
              },
            });

            editor.addAction({
              id: 'graphql.run',
              label: 'Run GraphQL Operation',
              contextMenuOrder: 0,
              contextMenuGroupId: 'graphql',
              keybindings: [
                // eslint-disable-next-line no-bitwise
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              ],
              run: async () => {
                const operations = await getOperationNames();
                if (operations.length > 1) {
                  editor.trigger('graphql.run', 'graphql.selectOperation', {});
                } else {
                  executeCurrentOp(operations[0]);
                }
              },
            });
          }}
          ref={editorRef}
          options={{
            minimap: {
              enabled: false,
            },
            fontFamily: MONO_FONTS,
            fontSize: 12,
          }}
        />
        <div width="35vw" height="100vh" overflow="scroll">
          <ResultViewer result={result} />
        </div>
        <row gap={3} position="fixed" right={4} top={3}>
          <Button
            onClick={() =>
              editorRef.current?.trigger('play button', 'graphql.run', {})
            }
            backgroundColor="blue.800"
            p={2}
          >
            <svg viewBox="10 10 60 60">
              <polygon fill="white" points="32,25 32,58 60,42"></polygon>
            </svg>
          </Button>
          <Button
            onClick={() => setOpen((open) => !open)}
            backgroundColor="#E535AB"
            p={2}
          >
            <GraphQLogo color="white" />
          </Button>
        </row>
      </row>
      <Modal isOpen={open} toggle={setOpen}>
        <column
          width="100%"
          gap={3}
          css={{
            '*': {
              fontFamily: `${MONO_FONTS} !important`,
            },
          }}
        >
          <div fontSize={3} fontWeight="bold">
            Playground Settings
          </div>
          <ReactJSON
            displayDataTypes={false}
            name="projects"
            src={settings}
            onEdit={(a) => setSettings(a.updated_src as any)}
            onDelete={(a) => setSettings(a.updated_src as any)}
            onAdd={(a) => setSettings(a.updated_src as any)}
            style={{
              fontSize: 12,
              fontFamily: `${MONO_FONTS} !important`,
            }}
          ></ReactJSON>
        </column>
      </Modal>
    </>
  );
}

function Button(props) {
  return (
    <grid
      fontSize={7}
      as="button"
      border="none"
      borderRadius="100px"
      height="1.5em"
      width="1.5em"
      cursor="pointer"
      boxShadow="large"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      placeItems="center"
      {...props}
    />
  );
}

function ResultViewer({ result }: { result: object }) {
  return (
    <div p={3}>
      {Object.keys(result).length === 0 ? (
        <div fontFamily={MONO_FONTS} fontSize={2} color="grey.700">
          Run a query to see results
        </div>
      ) : (
        <ReactJSON
          src={result}
          displayDataTypes={false}
          indentWidth={2}
          name={null}
          displayObjectSize={false}
          // collapsed={3}
          style={{
            fontSize: 12,
            fontFamily: MONO_FONTS,
          }}
        />
      )}
    </div>
  );
}
