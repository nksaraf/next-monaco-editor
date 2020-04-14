import React from 'react';
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
  const [result, setResult] = React.useState({});

  React.useEffect(() => {
    if (editorRef.current?.getModel()?.getValue() !== query) {
      editorRef.current?.getModel()?.setValue(query);
    }
  }, [query, editorRef.current]);

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
            flexDirection: 'column-reverse !important' as any,
          },
          '.graphiql-explorer-root input': {
            fontSize: '12px',
            // minWidth: 'fit-content',
            minWidth: '8ch !important',
            width: 'none !important',
          },
          '.graphiql-explorer-actions': {
            borderTop: 'none !important',
            // minWidth: 'fit-content',
            // borderBottom: 'solid 2px lightgray !important',
          },
          '.graphiql-explorer-actions select': {
            marginLeft: 2,
            // minWidth: 'fit-content',
            // borderBottom: ''
          },
          '.doc-explorer-title-bar': {
            display: 'none !important',
          },
          '.gutter': {
            cursor: 'col-resize',
            backgroundColor: 'grey.200',
          },
        }}
      />
      {/* <row width="100vw" height="100vh" alignItems="flex-start" gap={0}> */}
      <Split
        sizes={[20, 45, 35]}
        style={{ display: 'flex' }}
        direction="horizontal"
        cursor="col-resize"
        // gutterStyle={{
        //   cursor: 'col-resize',
        // }}
        onDrag={() => {
          editorRef.current?.layout();
        }}
      >
        <div height="100vh" overflow="scroll">
          <div>
            <Explorer
              width="20vw"
              query={query}
              onEdit={setQuery}
              explorerIsOpen={true}
              schema={schema}
            />
          </div>
        </div>
        <Editor
          onChange={(val: string) => setQuery(val)}
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
      </Split>
      {/* </row> */}
    </>
  );
}
