import React, { SuspenseList } from 'react';
import Editor from 'next-monaco-editor';
import monaco from 'next-monaco-editor/api';
import registerGraphql from '../src/languages/graphql';
import { UrlLoader } from '../src/languages/graphql/LanguageService';
import { Global } from 'magic-components';
import dedent from 'dedent';
import Explorer from 'graphiql-explorer';
import { GraphQLSchema } from 'graphql';
import dynamic from 'next/dynamic';
// import Split from 'react-split';

const ReactJSON = dynamic(() => import('react-json-view'), { ssr: false });
const Split = dynamic(() => import('react-split'), { ssr: false });

export default function App() {
  const [schema, setSchema] = React.useState<GraphQLSchema | null>(null);
  const [query, setQuery] = React.useState(dedent`query Pokemon {
    pokemon(name: "Pikachu") {
      id
      number
      name
      attacks {
        special {
          name
          type
          damage
        }
      }
      evolutions {
        id
        number
        name
        weight {
          minimum
          maximum
        }
        attacks {
          fast {
            name
            type
            damage
          }
        }
      }
    }
  }`);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>(null);
  const uri = 'https://graphql-pokemon.now.sh/';
  React.useEffect(() => {
    new UrlLoader().load(uri, {}).then((r) => setSchema(r.schema));
  }, []);
  // const firstEdit = React.useRef(false);
  const [result, setResult] = React.useState({});

  React.useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current?.getModel()?.getValue() !== query
    ) {
      editorRef.current.pushUndoStop();
      const model = editorRef.current.getModel();
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: query,
          },
        ],
        () => null
      );
      editorRef.current.pushUndoStop();
      editorRef.current?.getModel()?.setValue(query);
    }
  }, [query, editorRef.current]);

  const onChange = React.useCallback((val: string) => {
    // debugger;
    setQuery(val);
  }, []);

  return (
    <>
      <Global
        style={{
          body: { margin: 0 },
          '*': {
            boxSizing: 'border-box',
          },
          '.graphiql-explorer-root': {
            fontFamily: 'SFMono,monospace !important',
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
        }}
      />
      {/* <row width="100vw" height="100vh" alignItems="flex-start" gap={0}> */}
      <row
        as={Split}
        width="100vw"
        noMotion
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
                width="20vw"
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
          defaultValue={query}
          height="100vh"
          // width="45vw"
          language="graphql"
          editorWillMount={(monaco: any) => {
            // monaco.worker.register({
            //   languageId: 'typescript',
            //   label: 'reactscript',
            //   providers: { hover: true },
            // });
            registerGraphql(monaco, uri);
          }}
          editorDidMount={(editor, monaco) => {
            async function executeCurrentOp() {
              // monaco.
              try {
                const operation = editor.getValue();
                // const variables = variablesEditor.getValue();
                const body: { variables?: string; query: string } = {
                  query: operation,
                };
                // const parsedVariables = JSON.parse(variables);
                // if (parsedVariables && Object.keys(parsedVariables).length) {
                //   body.variables = variables;
                // }
                const result = await fetch(uri, {
                  method: 'POST',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify(body),
                });
                const resultText = await result.text();
                setResult(JSON.parse(resultText));
              } catch (err) {
                setResult(err);
              }
            }

            editorRef.current?.focus();

            const opAction: monaco.editor.IActionDescriptor = {
              id: 'graphql-run',
              label: 'Run Operation',
              contextMenuOrder: 0,
              contextMenuGroupId: 'graphql',
              keybindings: [
                // eslint-disable-next-line no-bitwise
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              ],
              run: executeCurrentOp,
            };
            editor.addAction(opAction);
          }}
          ref={editorRef}
          options={{
            minimap: {
              enabled: false,
            },
            fontFamily: 'SFMono',
            fontSize: 12,
            formatOnSave: true,
          }}
        />
        <div width="35vw" height="100vh" overflow="scroll">
          <div p={3}>
            <ReactJSON
              src={result}
              displayDataTypes={false}
              indentWidth={2}
              name={null}
              collapsed={3}
              style={{ fontSize: 12, fontFamily: 'SFMono' }}
            />
          </div>
          {/* <button>Run</button> */}
        </div>
      </row>
      {/* </row> */}
    </>
  );
}
