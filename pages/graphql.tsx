import React from 'react';

import { important, useTheme, AnimatePresence } from 'magic-components';
import MonacoEditor from '@editor';
import monaco from '@monaco';
import { fixPath } from '../lib/utils';

import { useFiles, useLocalStorage } from '@hooks';
import { SplitView } from 'toolbox/SplitView';
import { JSONViewer, jsonViewerTheme } from 'toolbox/JSONViewer';
import { ActionButton, ActionBar } from 'toolbox/ActionButton';
import { PlaySVG, CancelSVG, CogSVG } from 'toolbox/Icons';
import { JSONResult } from 'toolbox/JSONViewer';
import GraphiQLExplorer from 'sandboxes/graphql/Explorer';
import { SandboxHead, monoFontStyles, RUBIK } from 'toolbox/SandboxHead';

import { graphql, prettier } from 'lib/plugins';
import 'lib/plugins/workers';
import { UrlLoader } from 'lib/plugins/graphql/url-schema-loader';

import { ThemeProvider, Select } from 'react-ui';
import YAML from 'yaml';
import { useQuery } from 'react-query';

function useGraphQLSchema(config: any) {
  const { schema: schemaURI, headers } = config || {};
  const { data, error, status } = useQuery(
    // @ts-ignore
    ['schema', schemaURI, headers],
    () => new UrlLoader().load(schemaURI, { headers }),
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnMount: false,
      retry: false,
    }
  );
  return { schema: data, error: error as any, status };
}

function graphqlPath(project: string) {
  return `/${project}.graphql`;
}

// const reducer = (state, event, exec) => {};

const GRAPHQL_CONFIG_PATH = '/graphql-config.yml';

function useGraphQL() {
  const [activeProject, setActiveProject] = useLocalStorage(
    'current-project',
    'pokemon'
  );
  const activeProjectRef = React.useRef<string>(activeProject);
  activeProjectRef.current = activeProject;

  const [config, setConfigState] = useLocalStorage<{ [key: string]: any }>(
    'graphql-config',
    {
      pokemon: {
        schema: 'https://graphql-pokemon.now.sh/',
        headers: {},
      },
    }
  );

  const configRef = React.useRef<any>(config);
  configRef.current = config;

  const initialFiles = {
    [GRAPHQL_CONFIG_PATH]: YAML.stringify(config),
  };

  if (config) {
    Object.keys(config).forEach((key) => {
      initialFiles[graphqlPath(key)] = '';
    });
  }

  const files = useFiles('graphql', initialFiles);
  React.useEffect(() => {
    try {
      const parsedConfig = YAML.parse(
        files.filesRef.current[GRAPHQL_CONFIG_PATH]
      );
      setConfigState(parsedConfig);
      Object.keys(parsedConfig).forEach((s) => {
        const getConfig = parsedConfig[s] || {};
        if (!files.filesRef.current[graphqlPath(s)] && getConfig.schema) {
          files.setFile(graphqlPath(s), '');
        }
      });
    } catch (e) {
      // c
    }
  }, [
    files.filesRef.current[GRAPHQL_CONFIG_PATH],
    setConfigState,
    files.setFile,
  ]);

  const setConfig = React.useCallback(
    (newValue: object) => {
      setConfigState(newValue);
      files.setFile(GRAPHQL_CONFIG_PATH, YAML.stringify(newValue));
    },
    [setConfigState]
  );

  const projects = Object.keys(configRef.current);
  const projectConfig = configRef.current[activeProjectRef.current];
  const projectDoc =
    files.filesRef.current[graphqlPath(activeProjectRef.current)];
  const setProjectDoc = (value: string) =>
    files.setFile(graphqlPath(activeProjectRef.current), value);

  const [result, setResult] = React.useState({});
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );
  return {
    ...files,
    projects,
    configRef,
    setConfig,
    activeProjectRef,
    setActiveProject,
    projectConfig,
    result,
    editorRef,
    setResult,
    projectDoc,
    setProjectDoc,
  };
}

export default function GraphQLSandbox() {
  const graphQLBox = useGraphQL();
  return (
    <>
      <SandboxHead title="GraphQL Sandbox">
        <link rel="shortcut icon" href="//graphql.org/img/favicon.png" />
      </SandboxHead>
      <ThemeProvider>
        <div width="full" height="full">
          <SplitView
            sizes={[20, 45, 35]}
            direction="horizontal"
            onDrag={() => {
              graphQLBox.editorRef.current?.layout();
            }}
          >
            <column gap={1}>
              <div height="100vh" overflow="scroll" px={1}>
                <column gap={0} pt={2}>
                  <Projects {...graphQLBox} />
                  <Explorer {...graphQLBox} />
                </column>
              </div>
            </column>
            <div height="100vh" position="relative">
              <Editor {...graphQLBox} />
            </div>
            <div height="100vh" overflow="scroll" layoutId="result-viewer">
              <JSONResult result={graphQLBox.result} />
            </div>
          </SplitView>
        </div>
      </ThemeProvider>
    </>
  );
}

function Explorer({ projectConfig, projectDoc, setProjectDoc }: any) {
  const { schema, error, status } = useGraphQLSchema(projectConfig);

  if (status === 'loading' && !schema) {
    return (
      <div fontFamily={RUBIK} fontSize={3} p={3}>
        Loading schema
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div fontFamily={RUBIK} fontSize={3} p={3}>
        Failed to load schema <br />
        {error?.toString()}
      </div>
    );
  }

  return schema ? (
    <>
      <style
        id="explorer"
        css={{
          '.graphiql-explorer-root': important({
            ...monoFontStyles,
            px: '16px',
            py: '16px',
          }),
          '.graphiql-explorer-root input': {
            fontSize: '12px',
            minWidth: important('8ch'),
            width: important('none'),
          },
          '.graphiql-explorer-actions select': {
            marginLeft: 2,
          },
          '.doc-explorer-title-bar': {
            display: important('none'),
          },
        }}
      />
      <GraphiQLExplorer
        width={'100%' as any}
        query={projectDoc}
        onEdit={setProjectDoc}
        explorerIsOpen={true}
        schema={schema.schema}
        showAttribution={false}
      />
    </>
  ) : null;
}

function Projects({ activeProjectRef, setActiveProject, projects }: any) {
  const theme = useTheme();
  return (
    <column px={3} pt={2} gap={3}>
      {/* <row
        gap={2}
        fontSize={4}
        fontFamily={RUBIK}
        color="#D64292"
        alignItems="center"
      >
        <img src="https://graphql.org/img/logo.svg" width={'24px'} />
        <row gap={0}>
          <span fontWeight={300}>GraphQL</span>
          <span fontWeight={400} color="#1F61A0">
            SandBox
          </span>
        </row>
      </row> */}
      <Select
        css={{
          fontFamily: RUBIK,
          border: 'none',
          color: 'white',
          borderRadius: 2,
          backgroundColor: theme.colors.blueGrey[900],
        }}
        value={activeProjectRef.current}
        onChange={(e: { currentTarget: { value: any } }) => {
          setActiveProject(e.currentTarget.value);
        }}
      >
        {projects.map((proj: string) => (
          <option value={proj} id={proj} key={proj}>
            {proj}
          </option>
        ))}
      </Select>
    </column>
  );
}

function Editor({
  setFile,
  activeProjectRef,
  projectConfig,
  setActiveProject,
  filesRef,
  configRef,
  setResult,
  editorRef,
}: any) {
  const [path, setPath] = useLocalStorage('open-file', GRAPHQL_CONFIG_PATH);
  const [variables, setVariables] = React.useState({});
  const variablesRef = React.useRef<any>(variables);
  variablesRef.current = variables;
  const onChange = React.useCallback(
    (val: string) => {
      setFile(path, val);
    },
    [setFile, path]
  );
  React.useEffect(() => {
    setPath(graphqlPath(activeProjectRef.current));
  }, [activeProjectRef.current]);
  return (
    <SplitView
      sizes={[75, 25]}
      direction="vertical"
      css={{ height: '100vh' }}
      onDrag={() => {
        editorRef.current?.layout();
      }}
    >
      <div height="100%">
        <style
          id="monaco"
          css={{
            '.monaco-editor': {
              paddingTop: '12px',
            },
          }}
        />
        <MonacoEditor
          onChange={onChange}
          files={filesRef.current}
          path={path}
          // layoutId="monaco-editor"
          height="100%"
          width="100%"
          id="graphql-sandbox"
          style={{ overflow: 'hidden' }}
          plugins={[prettier(['graphql', 'yaml']), graphql(projectConfig)]}
          onPathChange={(path, editor, monaco) => {
            monaco.worker.updateOptions(
              'graphql',
              configRef.current[activeProjectRef.current]
            );
          }}
          editorDidMount={(editor, monaco) => {
            const executeCurrentOp = async (opname?: string) => {
              // monaco.
              try {
                const model = monaco.editor
                  .getModels()
                  .find(
                    (model) =>
                      model.uri.path === graphqlPath(activeProjectRef.current)
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
                  variables: variablesRef.current,
                };
                // const parsedVariables = JSON.parse(variables);
                // if (parsedVariables && Object.keys(parsedVariables).length) {
                //   body.variables = variables;
                // }
                // const projSettings = getCurrentSettings();
                const projSettings =
                  configRef.current[activeProjectRef.current];
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

            const getOperations = async () => {
              const worker = await monaco.worker.get<{
                getAST: (path: string) => any;
              }>(
                'graphql',
                monaco.Uri.file(graphqlPath(activeProjectRef.current))
              );
              const ast = await worker.getAST(
                monaco.Uri.file(
                  graphqlPath(activeProjectRef.current)
                ).toString()
              );
              return ast.definitions;
            };

            const getOperationNames = async () => {
              const definitions = await getOperations();
              const operations = definitions
                .map((d: any) => d?.name?.value)
                .filter((a: any) => !!a);
              return operations;
            };

            const getVariables = async () => {
              const definitions = await getOperations();
              const variables = definitions
                .flatMap((d: any) => {
                  if (d?.variableDefinitions?.length > 0) {
                    return d.variableDefinitions.map(
                      (defn: { variable: { name: { value: any } } }) =>
                        defn.variable.name.value
                    );
                  }
                })
                .filter((a: any) => !!a);
              return variables;
            };

            let disposables: monaco.IDisposable[] = [];

            disposables.push(
              editor.addAction({
                id: 'graphql.editConfig',
                label: 'Preferences: GraphQL Config',
                contextMenuOrder: 2,
                contextMenuGroupId: 'graphql',
                run: async () => {
                  setPath(GRAPHQL_CONFIG_PATH);
                },
              })
            );

            disposables.push(
              editor.addSelectAction({
                id: 'graphql.selectOperation',
                label: 'Run GraphQL Operation by Name',
                choices: () => getOperationNames(),
                runChoice: function (value, mode) {
                  if (mode === 1) executeCurrentOp(value);
                },
              })
            );

            disposables.push(
              editor.addSelectAction({
                id: 'graphql.selectProject',
                label: 'Select GraphQL Project',
                choices: () => Object.keys(configRef.current),
                contextMenuOrder: 1,
                contextMenuGroupId: 'graphql',
                runChoice: function (value, mode) {
                  if (mode === 1) {
                    setActiveProject(value);
                  }
                },
              })
            );

            const updateVariables = async () => {
              try {
                if (editor.getModel()?.getModeId() === 'graphql') {
                  const vars = Object.fromEntries(
                    (await getVariables()).map((v: any) => [v, ''])
                  );
                  setVariables(vars);
                }
              } catch (e) {}
            };

            disposables.push(editor.onDidChangeModelContent(updateVariables));
            disposables.push(editor.onDidChangeModel(updateVariables));
            // updateVariables();
            disposables.push(
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
              })
            );

            disposables.push(
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
                    editor.trigger(
                      'graphql.run',
                      'graphql.selectOperation',
                      {}
                    );
                  } else {
                    if (operations.length === 1) {
                      executeCurrentOp(operations[0]);
                    } else {
                      executeCurrentOp();
                    }
                  }
                },
              })
            );

            return disposables;
          }}
          ref={editorRef}
          options={{
            minimap: {
              enabled: false,
            },
            fontFamily: monoFontStyles.fontFamily,
            fontSize: 12,
            letterSpacing: 0.2,
            lineNumbers: 'off',
            renderLineHighlight: 'none',

            scrollbar: {
              vertical: 'auto',
              verticalScrollbarSize: 8,
              useShadows: false,
            },
          }}
        />
        <GraphQLActionBar
          editorRef={editorRef}
          path={path}
          setPath={setPath}
          activeProjectRef={activeProjectRef}
        />
      </div>
      <div p={3}>
        <JSONViewer
          theme={jsonViewerTheme}
          src={variablesRef.current}
          onEdit={(src: { updated_src: React.SetStateAction<{}> }) =>
            setVariables(src.updated_src)
          }
          onAdd={(src: { updated_src: React.SetStateAction<{}> }) =>
            setVariables(src.updated_src)
          }
          onDelete={(src: { updated_src: React.SetStateAction<{}> }) =>
            setVariables(src.updated_src)
          }
        />
      </div>
    </SplitView>
  );
}

function GraphQLActionBar({ editorRef, path, setPath, activeProjectRef }: any) {
  return (
    <ActionBar>
      <ActionButton
        tooltipTitle="Run GraphQL"
        onClick={() =>
          editorRef.current?.trigger('play button', 'graphql.run', {})
        }
        backgroundColor="#D64292"
        layoutId="run-button"
      >
        <PlaySVG />
      </ActionButton>
      {path !== GRAPHQL_CONFIG_PATH ? (
        <ActionButton
          p="12px"
          tooltipTitle="Edit Config"
          // onClick={() => setOpen((open) => !open)}
          onClick={() =>
            editorRef.current?.trigger(
              'graphql config',
              'graphql.editConfig',
              {}
            )
          }
          layoutId="settings-button"
          backgroundColor="blueGrey.900"
        >
          <CogSVG color="white" />
        </ActionButton>
      ) : (
        <ActionButton
          tooltipTitle="Go Back"
          onClick={() => {
            setPath(graphqlPath(activeProjectRef.current));
          }}
          backgroundColor="blueGrey.700"
          padding={2}
        >
          <CancelSVG color="white" />
        </ActionButton>
      )}
    </ActionBar>
  );
}
