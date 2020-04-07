import React, { Suspense } from 'react';
import { MonacoEditorProps } from './MonacoEditor';
import { processDimensions } from './utils';
export interface NextMonacoEditorProps extends MonacoEditorProps {
  loading?: React.ReactNode;
}

const loadingStyles = {
  display: 'flex',
  height: '100%',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};

export function Loading({
  children,
  style = {},
  className = 'next-monaco-editor-loading',
}) {
  return (
    <div
      data-editor="next-monaco-editor-loading"
      className={className}
      style={{ ...loadingStyles, ...style }}
    >
      {children}
    </div>
  );
}

let Editor: React.FC<NextMonacoEditorProps>;
if (typeof window !== 'undefined') {
  const MonacoEditor = React.lazy(() => import('./MonacoEditor'));
  Editor = ({
    width = 800,
    height = 600,
    loading = 'Loading Editor',
    ...props
  }: NextMonacoEditorProps) => {
    return (
      <div style={processDimensions(width, height)}>
        <Suspense fallback={<Loading>{loading}</Loading>}>
          <MonacoEditor {...props} />
        </Suspense>
      </div>
    );
  };
} else {
  Editor = ({ width = 800, height = 600 }: NextMonacoEditorProps) => {
    return <div style={processDimensions(width, height)} />;
  };
}

export { Editor };
