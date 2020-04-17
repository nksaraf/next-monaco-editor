import React, { useState } from 'react';
import Editor from 'next-monaco-editor';
import monaco from 'next-monaco-editor/api';
import registerGraphql from './monaco-graphql';
import { UrlLoader } from './monaco-graphql/LanguageService';
import { Global } from 'magic-components';
import Explorer from 'graphiql-explorer';
import { GraphQLSchema } from 'graphql';
import dynamic from 'next/dynamic';
import { GraphQLogo } from './GraphQLogo';
import { Modal } from './Modal';
import YAML from 'yaml';
import { fixPath } from 'next-monaco-editor/utils';
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

function useGraphQLSchema(config: any) {
  const [schema, setSchema] = React.useState<GraphQLSchema | null>(null);

  const { schema: schemaURI, headers } = config || {};
  React.useEffect(() => {
    if (schemaURI) {
      new UrlLoader()
        .load(schemaURI, { headers })
        .then((r: { schema: GraphQLSchema | null }) => setSchema(r.schema));
    }
  }, [schemaURI]);
  return schema;
}

// Hook
function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  overrideInitial: boolean = false
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (overrideInitial) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
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

function useFiles(initialFiles: any) {
  const [files, setFiles] = useLocalStorage('files', initialFiles);
  const filesRef = React.useRef<object>(files);
  filesRef.current = files;

  const setFile = React.useCallback(
    (path: string, value: string) => {
      setFiles((files: any) => ({ ...files, [fixPath(path)]: value }));
    },
    [setFiles]
  );

  const getFile = (path: string) => files[fixPath(path)];
  return { filesRef, setFile, getFile };
}

function graphqlPath(project: string) {
  return `/${project}.graphql`;
}

const GRAPHQL_CONFIG_PATH = '/graphql-config.yml';

function useGraphQL() {
  const [settings, setSettingsState] = useLocalStorage<{ [key: string]: any }>(
    'graphql-config',
    {
      pokemon: {
        schema: 'https://graphql-pokemon.now.sh/',
        headers: {},
      },
    }
  );

  const settingsRef = React.useRef<any>(settings);
  settingsRef.current = settings;

  const initialFiles = {
    [GRAPHQL_CONFIG_PATH]: YAML.stringify(settings),
  };

  if (settings) {
    Object.keys(settings).forEach((key) => {
      initialFiles[graphqlPath(key)] = '';
    });
  }

  const files = useFiles(initialFiles);
  React.useEffect(() => {
    try {
      const sett = YAML.parse(files.filesRef.current[GRAPHQL_CONFIG_PATH]);
      setSettingsState(sett);
      Object.keys(sett).forEach((s) => {
        if (!files.filesRef.current[graphqlPath(s)]) {
          files.setFile(graphqlPath(s), '');
        }
      });
    } catch (e) {
      // c
    }
  }, [
    files.filesRef.current[GRAPHQL_CONFIG_PATH],
    setSettingsState,
    files.setFile,
  ]);

  const setSettings = React.useCallback(
    (newValue: object) => {
      setSettingsState(newValue);
      files.setFile(GRAPHQL_CONFIG_PATH, YAML.stringify(newValue));
    },
    [setSettingsState]
  );

  return { ...files, settingsRef, setSettings };
}

export function Playground() {
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const [currentProject, setCurrentProject] = useLocalStorage(
    'current-project',
    'pokemon'
  );
  const currentProjectRef = React.useRef<string>('');
  currentProjectRef.current = currentProject;

  const { filesRef, setFile, settingsRef, setSettings } = useGraphQL();
  const [path, setPath] = useLocalStorage('open-file', GRAPHQL_CONFIG_PATH);
  const onChange = React.useCallback(
    (val: string) => {
      setFile(path, val);
    },
    [setFile, path]
  );

  const schema = useGraphQLSchema(
    settingsRef.current[currentProjectRef.current]
  );
  const [result, setResult] = React.useState({});
  const [open, setOpen] = React.useState(false);

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
          <column gap={2} py={2}>
            <column gap={1} px={3}>
              <div fontSize={2} fontFamily={MONO_FONTS}>
                Current Project
              </div>
              <select
                value={currentProject}
                onChange={(e) => setCurrentProject(e.currentTarget.value)}
              >
                {Object.keys(settingsRef.current).map((proj) => (
                  <option value={proj} id={proj} key={proj}>
                    {proj}
                  </option>
                ))}
              </select>
            </column>
            {schema && (
              <Explorer
                width="100%"
                query={filesRef.current[graphqlPath(currentProjectRef.current)]}
                // query={editorRef.current?.getModel()?.getValue()}
                onEdit={(value: string) =>
                  setFile(graphqlPath(currentProjectRef.current), value)
                }
                // onEdit={editValue}
                explorerIsOpen={true}
                schema={schema}
              />
            )}
          </column>
        </div>
        <Editor
          onChange={onChange}
          height="100vh"
          files={filesRef.current}
          path={path}
          style={{ overflow: 'hidden' }}
          editorWillMount={(monaco: any) => {
            registerGraphql(monaco, settingsRef.current[currentProject]);
          }}
          editorDidMount={(editor, monaco) => {
            const executeCurrentOp = async (opname?: string) => {
              // monaco.
              try {
                const model = monaco.editor
                  .getModels()
                  .find(
                    (model) =>
                      model.uri.path === graphqlPath(currentProjectRef.current)
                  );
                if (!model) {
                  return;
                }
                const operation = model?.getValue();
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
                // const projSettings = getCurrentSettings();
                const projSettings =
                  settingsRef.current[currentProjectRef.current];
                console.log(projSettings);
                const result = await fetch(projSettings.schema, {
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
            };

            const getOperationNames = async () => {
              const worker = await monaco.worker.get(
                'graphql',
                graphqlPath(currentProjectRef.current)
              );
              // const typescript = await monaco.worker.get('typescript');
              const ast = await worker.getAST(
                monaco.Uri.file(
                  graphqlPath(currentProjectRef.current)
                ).toString()
              );
              const operations = ast.definitions
                .map((d: any) => d?.name?.value)
                .filter((a) => !!a);
              return operations;
            };

            editor.addAction({
              id: 'graphql.editConfig',
              label: 'Preferences: GraphQL Config',
              contextMenuOrder: 2,
              contextMenuGroupId: 'graphql',
              run: async () => {
                setPath(GRAPHQL_CONFIG_PATH);
              },
            });

            editor.addSelectAction({
              id: 'graphql.selectOperation',
              label: 'Run GraphQL Operation by Name',
              choices: () => getOperationNames(),
              runChoice: function (value, mode) {
                if (mode === 1) executeCurrentOp(value);
              },
            });

            editor.addSelectAction({
              id: 'graphql.selectProject',
              label: 'Select GraphQL Project',
              choices: () => Object.keys(settingsRef.current),
              contextMenuOrder: 1,
              contextMenuGroupId: 'graphql',
              runChoice: function (value, mode) {
                if (mode === 1) setCurrentProject(value);
              },
            });

            editor.addSelectAction({
              id: 'editor.action.openFile',
              label: 'Open File',
              contextMenuOrder: 3,
              contextMenuGroupId: 'navigation',
              keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_O],
              choices: () =>
                Object.keys(filesRef.current).map((f) =>
                  fixPath(f).substring(1)
                ),
              runChoice: function (value, mode) {
                if (mode === 1) setPath(fixPath(value));
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
              // run: runGraphQL(monaco, editor),
              run: async () => {
                const operations = await getOperationNames();
                if (operations.length > 1) {
                  editor.trigger('graphql.run', 'graphql.selectOperation', {});
                } else {
                  if (operations.length === 1) {
                    executeCurrentOp(operations[0]);
                  } else {
                    executeCurrentOp();
                  }
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
          >
            <svg viewBox="10 10 60 60">
              <polygon fill="white" points="32,25 32,58 60,42"></polygon>
            </svg>
          </Button>
          <Button
            // onClick={() => setOpen((open) => !open)}
            onClick={() =>
              editorRef.current?.trigger(
                'graphql config',
                'graphql.editConfig',
                {}
              )
            }
            backgroundColor="#E535AB"
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
            src={settingsRef.current}
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

function Button(props: any) {
  return (
    <grid
      fontSize={7}
      as="button"
      cursor="pointer"
      border="none"
      backgroundColor="#E535AB"
      borderRadius="100px"
      height="1.5em"
      width="1.5em"
      p={2}
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
