import React, { Suspense } from 'react';
import { MonacoEditorProps } from './MonacoEditor';
import { processDimensions } from '../utils';
import monaco from '@monaco';
import { Loading, SpectrumLoading } from './Loading';
export interface EditorProps extends MonacoEditorProps {
  loading?: React.ReactNode;
}

let Editor: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<EditorProps> &
    React.RefAttributes<monaco.editor.IStandaloneCodeEditor>
>;
if (typeof window !== 'undefined') {
  const MonacoEditor: any = React.lazy(() => import('@monaco-editor'));
  MonacoEditor.displayName = 'MonacoEditor';
  Editor = React.forwardRef<monaco.editor.IStandaloneCodeEditor, EditorProps>(
    (
      {
        width = 800,
        height = 600,
        id = 'monaco',
        loading,
        ...props
      }: EditorProps,
      ref
    ) => {
      props.theme =
        (window.localStorage.getItem(`${id}-theme`) as any) ||
        props.theme ||
        'vs-dark';

      props.onThemeChange =
        props.onThemeChange ||
        ((theme) => window.localStorage.setItem(`${id}-theme`, theme));

      return (
        <div style={processDimensions(width, height)}>
          <Suspense
            fallback={
              loading ? (
                <Loading>{loading}</Loading>
              ) : (
                <SpectrumLoading
                  {...props}
                  id={id}
                  width={width}
                  height={height}
                />
              )
            }
          >
            <MonacoEditor {...props} id={id} ref={ref} />
          </Suspense>
        </div>
      );
    }
  );
} else {
  Editor = React.forwardRef<monaco.editor.IStandaloneCodeEditor, EditorProps>(
    ({ width = 800, height = 600 }: EditorProps, ref) => {
      return <div style={processDimensions(width, height)} ref={ref as any} />;
    }
  );
}

Editor.displayName = 'Editor';

export default Editor;

export { Editor };
