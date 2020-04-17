import React, { Suspense } from 'react';
import { MonacoEditorProps } from './MonacoEditor';
import { processDimensions } from './utils';
import { monaco } from './api';
import { Loading, SpectrumLoading } from './Loading';
export interface EditorProps extends MonacoEditorProps {
  loading?: React.ReactNode;
}

let Editor: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<EditorProps> &
    React.RefAttributes<monaco.editor.IStandaloneCodeEditor>
>;
if (typeof window !== 'undefined') {
  const MonacoEditor: any = React.lazy(() => import('./MonacoEditor'));
  MonacoEditor.displayName = 'MonacoEditor';
  Editor = React.forwardRef<
    monaco.editor.IStandaloneCodeEditor,
    EditorProps
  >(
    (
      { width = 800, height = 600, loading, ...props }: EditorProps,
      ref
    ) => {
      props.theme =
        (localStorage.getItem('theme') as any) || props.theme || 'vs-dark';
      return (
        <div style={processDimensions(width, height)}>
          <Suspense
            fallback={
              loading ? (
                <Loading>{loading}</Loading>
              ) : (
                <SpectrumLoading {...props} width={width} height={height} />
              )
            }
          >
            <MonacoEditor {...props} ref={ref} />
          </Suspense>
        </div>
      );
    }
  );
} else {
  Editor = React.forwardRef<
    monaco.editor.IStandaloneCodeEditor,
    EditorProps
  >(({ width = 800, height = 600 }: EditorProps, ref) => {
    return <div style={processDimensions(width, height)} ref={ref as any} />;
  });
}

Editor.displayName = 'Editor';

export { Editor };