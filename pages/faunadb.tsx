import { SplitView } from '../playground/toolbox/SplitView';
import { SandboxHead, monoFontStyles } from '../playground/toolbox/SandboxHead';
import MonacoEditor from 'next-monaco-editor';
import monaco from 'next-monaco-editor/api';

import 'plugins/typings/typings.monaco.worker';
import 'plugins/prettier/prettier.monaco.worker';
import 'plugins/faunadb/faunadb.monaco.worker';
import { prettier, typings, faunadb } from 'plugins';
import { useFiles } from 'playground/toolbox/useFiles';
import { Button } from 'playground/toolbox/ActionButton';
import { JSONViewer } from 'playground/toolbox/JSONViewer';
import { PlaySVG, CogSVG, CancelSVG } from 'playground/toolbox/Icons';

export default () => {
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  const [path, setCurrentPath] = React.useState('/index.ts');
  const { filesRef, setFile } = useFiles('faunadb', {
    '/index.ts': 'q.Paginate(q.Collections())',
  });

  const [result, setResult] = React.useState({});

  const onChange = React.useCallback(
    (val: string) => {
      setFile(path, val);
    },
    [setFile]
  );

  return (
    <>
      <SandboxHead title="FaunaDB Sandbox">
        <link rel="shortcut icon" href="//fauna.com/favicon.ico" />
      </SandboxHead>
      <div height="full" width="full">
        <SplitView
          direction="horizontal"
          sizes={[50, 50]}
          onDrag={() => {
            editorRef.current?.layout();
          }}
        >
          <div position="relative">
            <style
              id="monaco"
              css={{
                '.monaco-editor': {
                  paddingTop: '12px',
                },
                '.monaco-editor *': {
                  boxSizing: 'content-box',
                },
              }}
            />
            <MonacoEditor
              path={path}
              height="100%"
              width="100%"
              onChange={onChange}
              id="faunadb"
              ref={editorRef}
              defaultValue={filesRef.current['/index.ts']}
              plugins={[
                prettier(['typescript'], { semi: false, printWidth: 40 }),
                typings(),
                faunadb(),
              ]}
              editorDidMount={async (editor, monaco) => {
                await monaco.languages.typescript.loadTypes(
                  'faunadb',
                  '2.13.0'
                );

                monaco.languages.typescript.addGlobal(
                  `
                import * as faunadb from "./node_modules/faunadb";
                
                declare global {
                  export const q: typeof faunadb.query
                }
                `
                );

                editor.addAction({
                  id: 'faunadb.run',
                  label: 'Run FaunaDB Query',
                  contextMenuOrder: 0,
                  contextMenuGroupId: 'faunadb',
                  keybindings: [
                    // eslint-disable-next-line no-bitwise
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                  ],
                  // run: runGraphQL(monaco, editor),
                  run: async () => {
                    try {
                      const worker = await monaco.worker.get('faunadb');
                      setResult(
                        await worker.fetch(
                          monaco.Uri.file('/index.ts').toString()
                        )
                      );
                      editor.layout();
                    } catch (e) {
                      console.error(e);
                    }
                  },
                });
              }}
              options={{
                minimap: {
                  enabled: false,
                },
                fontFamily: monoFontStyles.fontFamily,
                fontSize: 12,
                letterSpacing: 0.2,
                scrollbar: {
                  vertical: 'hidden',
                  verticalScrollbarSize: 0,
                },
              }}
            />
            <row gap={3} position="absolute" top={'12px'} right={3}>
              <Button
                tooltipTitle="Run Query"
                backgroundColor="#3642ce"
                onClick={() => {
                  editorRef.current?.trigger('play', 'faunadb.run', {});
                }}
              >
                <PlaySVG />
              </Button>
              {path !== 'fauna.config.yml' ? (
                <Button
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
                  backgroundColor="blueGrey.900"
                >
                  <CogSVG color="white" />
                </Button>
              ) : (
                <Button
                  tooltipTitle="Go Back"
                  onClick={() => {
                    // setPath(graphqlPath(activeProjectRef.current));
                  }}
                  backgroundColor="blueGrey.700"
                  padding={2}
                >
                  <CancelSVG color="white" />
                </Button>
              )}
            </row>
          </div>
          <div height="100vh" overflow="scroll">
            <div p={3} height="full">
              <JSONViewer src={result} />
            </div>
          </div>
        </SplitView>
      </div>
    </>
  );
};
