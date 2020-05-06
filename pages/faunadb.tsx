import { SplitView } from 'toolbox/SplitView';
import { SandboxHead, monoFontStyles } from 'toolbox/SandboxHead';
import MonacoEditor from 'toolbox/Editor';
import monaco from 'monaco';

import 'lib/plugins/workers';
import { prettier, typings, faunadb } from 'lib/plugins';
import { useFiles } from 'lib/hooks/useFiles';
import { ActionButton } from 'toolbox/ActionButton';
import { PlaySVG, CogSVG, CancelSVG } from 'toolbox/Icons';
import { JSONResult } from 'toolbox/JSONViewer';

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
          sizes={[20, 45, 35]}
          onDrag={() => {
            editorRef.current?.layout();
          }}
        >
          <div></div>
          <div position="relative">
            <style
              id="monaco"
              css={{
                '.monaco-editor': {
                  paddingTop: '12px',
                },
              }}
            />
            <MonacoEditor
              path={path}
              height="100%"
              // layoutId="monaco-editor"
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
              editorDidMount={(editor, monaco) => {
                monaco.languages.typescript.loadTypes('faunadb', '2.13.0');
                monaco.languages.typescript.addGlobal(
                  `
                import * as faunadb from "./node_modules/faunadb";
                
                declare global {
                  export const q: typeof faunadb.query
                }
                `
                );

                let disposables = [];

                disposables.push(
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
                      } catch (e) {
                        console.error(e);
                      }
                    },
                  })
                );

                return disposables;
              }}
              options={{
                minimap: {
                  enabled: false,
                },
                fontFamily: monoFontStyles.fontFamily,
                fontSize: 12,
                letterSpacing: 0.2,

                scrollbar: {
                  vertical: 'auto',
                  verticalScrollbarSize: 8,
                  useShadows: false,
                },
              }}
            />
            <row gap={3} position="absolute" top={'12px'} right={3}>
              <ActionButton
                tooltipTitle="Run Query"
                backgroundColor="#3642ce"
                onClick={() => {
                  editorRef.current?.trigger('play', 'faunadb.run', {});
                }}
                layoutId="run-button"
              >
                <PlaySVG />
              </ActionButton>
              {path !== 'fauna.config.yml' ? (
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
                    // setPath(graphqlPath(activeProjectRef.current));
                  }}
                  backgroundColor="blueGrey.700"
                  padding={2}
                >
                  <CancelSVG color="white" />
                </ActionButton>
              )}
            </row>
          </div>
          <div layoutId="result-viewer" height="100vh" overflow="scroll">
            <JSONResult result={result} />
          </div>
        </SplitView>
      </div>
    </>
  );
};
