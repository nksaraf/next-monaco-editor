import React from 'react';
import MonacoEditor from 'next-monaco-editor';
import monaco from 'next-monaco-editor/api';
import registerGraphql from './monaco-graphql';
import { UrlLoader } from './monaco-graphql/url-schema-loader';
import { Global, useTheme, get } from 'magic-components';
import GraphiQLExplorer from './Explorer';
import { GraphQLSchema } from 'graphql';
import { ThemeProvider, Select } from 'react-ui';
import dynamic from 'next/dynamic';
import { GraphQLogo } from './GraphQLogo';
import { Modal } from './Modal';
import YAML from 'yaml';
import { fixPath } from 'next-monaco-editor/utils';
import { useQuery } from 'react-query';
import Head from 'next/head';
import { useLocalStorage } from './useLocalStorage';
import { useFiles } from './useFiles';
import { Tooltip } from 'react-tippy';
// import Split from 'react-split';

const ReactJSON = dynamic(() => import('react-json-view'), { ssr: false });
const Split = dynamic(() => import('react-split'), { ssr: false });
const RUBIK = 'Rubik, monospace';
const MONO_FONTS = 'Roboto Mono, monospace';

const monoFontStyles = {
  fontFamily: MONO_FONTS,
  fontSize: 12,
  letterSpacing: 0.2,
};

const important = (s: string) => `${s} !important`;
// Roboto Mono, SFMono, SF Mono, Inconsolata
const globalStyles: any = {
  body: { margin: 0 },
  '*': {
    boxSizing: 'border-box',
  },
  '.graphiql-explorer-root': {
    ...monoFontStyles,
    fontFamily: important(monoFontStyles.fontFamily),
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
  '.object-content span': {
    ...monoFontStyles,
    letterSpacing: important(monoFontStyles.letterSpacing + 'px'),
    opacity: important('1.0'),
  },
  '.tippy-tooltip': {
    fontFamily: RUBIK,
    fontSize: important('14px'),
  },
};

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
  return { schema: data, error, status };
}

function graphqlPath(project: string) {
  return `/${project}.graphql`;
}

const GRAPHQL_CONFIG_PATH = '/graphql-config.yml';

function useGraphQL() {
  const [activeProject, setActiveProject] = useLocalStorage(
    'current-project',
    'pokemon'
  );
  const activeProjectRef = React.useRef<string>('');
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

  const files = useFiles(initialFiles);
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

export function Playground() {
  const graphQLBox = useGraphQL();
  return (
    <>
      <PageHead />
      <ThemeProvider>
        <row
          as={Split}
          width="100vw"
          noMotion
          gap={0}
          maxHeight="100vh"
          sizes={[20, 45, 35]}
          direction="horizontal"
          onDrag={() => {
            graphQLBox.editorRef.current?.layout();
          }}
        >
          <column gap={1} px={1}>
            <div height="100vh" overflow="scroll">
              <column gap={0} pt={2}>
                <Projects {...graphQLBox} />
                <Explorer {...graphQLBox} />
              </column>
            </div>
          </column>
          <div height="100vh" position="relative">
            <Editor {...graphQLBox} />
          </div>
          <div width="35vw" height="100vh" overflow="scroll">
            <ResultViewer result={graphQLBox.result} />
          </div>
        </row>
      </ThemeProvider>
    </>
  );
}

const PageHead = () => {
  const Title = 'title';
  const Link = 'link';
  return (
    <>
      <Global style={globalStyles} />
      <Head>
        <Title>GraphQL Sandbox</Title>
        <Link
          rel="shortcut icon"
          href="//cdn.jsdelivr.net/npm/graphql-playground-react@1.7.8/build/favicon.png"
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
        <Link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
    </>
  );
};

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
        {error.toString()}
      </div>
    );
  }

  return schema ? (
    <GraphiQLExplorer
      width="100%"
      query={projectDoc}
      onEdit={setProjectDoc}
      explorerIsOpen={true}
      schema={schema.schema}
    />
  ) : null;
}

function Projects({ activeProjectRef, setActiveProject, projects }: any) {
  const theme = useTheme();
  return (
    <column px={3} pt={2} gap={3}>
      <row
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
      </row>
      <Select
        css={{
          fontFamily: RUBIK,
          border: 'none',
          color: 'white',
          borderRadius: 2,
          backgroundColor: 'rgba(23, 30, 38, 0.8)',
        }}
        value={activeProjectRef.current}
        onChange={(e) => {
          setActiveProject(e.currentTarget.value);
        }}
      >
        {projects.map((proj) => (
          <option value={proj} id={proj} key={proj}>
            {proj}
          </option>
        ))}
      </Select>
    </column>
  );
}

const Editor = ({
  setFile,
  activeProjectRef,
  projectConfig,
  setActiveProject,
  filesRef,
  configRef,
  setResult,
  editorRef,
}: any) => {
  const [path, setPath] = useLocalStorage('open-file', GRAPHQL_CONFIG_PATH);
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
    <>
      <MonacoEditor
        onChange={onChange}
        files={filesRef.current}
        path={path}
        height="100%"
        width="100%"
        style={{ overflow: 'hidden' }}
        editorWillMount={(monaco: any) => {
          registerGraphql(monaco, projectConfig);
        }}
        onPathChange={(path, editor, monaco) => {
          monaco.worker.setConfig('graphql', {
            options: configRef.current[activeProjectRef.current],
          });
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
              };
              // const parsedVariables = JSON.parse(variables);
              // if (parsedVariables && Object.keys(parsedVariables).length) {
              //   body.variables = variables;
              // }
              // const projSettings = getCurrentSettings();
              const projSettings = configRef.current[activeProjectRef.current];
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
            const worker = await monaco.worker.get(
              'graphql',
              graphqlPath(activeProjectRef.current)
            );
            // const typescript = await monaco.worker.get('typescript');
            const ast = await worker.getAST(
              monaco.Uri.file(graphqlPath(activeProjectRef.current)).toString()
            );
            return ast.definitions;
          };

          const getOperationNames = async () => {
            const definitions = await getOperations();
            const operations = definitions
              .map((d: any) => d?.name?.value)
              .filter((a) => !!a);
            return operations;
          };

          const getVariables = async () => {
            const definitions = await getOperations();
            const variables = definitions
              .flatMap((d: any) => {
                if (d?.variableDefinitions?.length > 0) {
                  return d.variableDefinitions.map(
                    (defn) => defn.variable.name.value
                  );
                }
              })
              .filter((a) => !!a);
            return variables;
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
            choices: () => Object.keys(configRef.current),
            contextMenuOrder: 1,
            contextMenuGroupId: 'graphql',
            runChoice: function (value, mode) {
              if (mode === 1) {
                setActiveProject(value);
              }
            },
          });

          editor.addSelectAction({
            id: 'editor.action.openFile',
            label: 'Open File',
            contextMenuOrder: 3,
            contextMenuGroupId: 'navigation',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_O],
            choices: () =>
              Object.keys(filesRef.current).map((f) => fixPath(f).substring(1)),
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
          ...monoFontStyles,
          lineNumbers: 'off',

          scrollbar: {
            vertical: 'hidden',
            verticalScrollbarSize: 0,
          },
        }}
      />
      <ActionBar
        editorRef={editorRef}
        path={path}
        setPath={setPath}
        activeProjectRef={activeProjectRef}
      />
    </>
  );
};

function ActionBar({ editorRef, path, setPath, activeProjectRef }: any) {
  return (
    <row gap={3} position="absolute" top={'12px'} right={3}>
      <Tooltip
        // options
        arrow={true}
        title="Run GraphQL"
        position="bottom"
        style={{ fontFamily: RUBIK }}
        trigger="mouseenter"
      >
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
      </Tooltip>
      <Tooltip
        // options
        arrow={true}
        title={path !== GRAPHQL_CONFIG_PATH ? 'Edit Config' : 'Go Back'}
        position="bottom"
        style={{ fontFamily: RUBIK }}
        trigger="mouseenter"
      >
        {path !== GRAPHQL_CONFIG_PATH ? (
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
        ) : (
          <Button
            onClick={() => {
              setPath(graphqlPath(activeProjectRef.current));
            }}
            backgroundColor="blueGrey.700"
            padding={2}
          >
            <CancelButton color="white" />
          </Button>
        )}
      </Tooltip>
    </row>
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
      css={{
        '&:focus': {
          outline: 'none',
        },
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      placeItems="center"
      {...props}
    />
  );
}

function CancelButton(props: any) {
  return (
    <svg
      className="svg-icon"
      viewBox="0 0 20 20"
      width="100%"
      height="100%"
      {...props}
    >
      <path
        fill="currentColor"
        d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"
      ></path>
    </svg>
  );
}

const theme = {
  base00: 'white',
  base01: '#ecebec',
  base02: '#ecebec',
  base03: '#444',
  base04: 'purple',
  base05: 'white',
  base06: 'white',
  base07: '#1F61A0', //property
  base08: 'white',
  base09: '#D64292', //string
  base0A: '#555',
  base0B: '#2882F9', // float
  base0C: '#8B2BB9', //index
  base0D: '#555', // arrow
  base0E: '#D47509', //boolean
  base0F: '#2882F9', //number, clipboard
};

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
          theme={theme}
          name={null}
          displayObjectSize={false}
          // collapsed={3}
          style={{
            ...monoFontStyles,
            letterSpacing: important(monoFontStyles.letterSpacing + 'px'),
          }}
        />
      )}
    </div>
  );
}

{
  /* <Modal isOpen={open} toggle={setOpen}>
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
            src={configRef.current}
            onEdit={(a) => setConfig(a.updated_src as any)}
            onDelete={(a) => setConfig(a.updated_src as any)}
            onAdd={(a) => setConfig(a.updated_src as any)}
            style={{
              fontSize: 12,
              fontFamily: `${MONO_FONTS} !important`,
            }}
          ></ReactJSON>
        </column>
      </Modal>*/
}
