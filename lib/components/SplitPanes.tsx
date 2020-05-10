import React, { Suspense } from 'react';

let SplitPanes: any;
if (typeof window !== 'undefined') {
  const ReactSplit: any = React.lazy(() => import('react-split'));
  ReactSplit.displayName = 'ReactSplit';
  SplitPanes = React.forwardRef((props, ref) => {
    return (
      <div>
        <Suspense fallback={<div>Loaing...</div>}>
          <ReactSplit {...props} ref={ref} />
        </Suspense>
      </div>
    );
  });
} else {
  SplitPanes = React.forwardRef((props, ref) => {
    return <div ref={ref as any} />;
  });
}

export function SplitView({ direction, children, css = {}, ...props }: any) {
  if (direction === 'horizontal') {
    return (
      <>
        <style
          css={{
            '.gutter-horizontal': {
              cursor: 'col-resize',
              backgroundColor: 'grey.200',
            },
          }}
          id="split-horizontal"
        />
        <row
          as={SplitPanes}
          gap={0}
          noMotion
          width="100%"
          height="100%"
          maxHeight="100vh"
          css={css}
          asProps={{ direction, ...props }}
        >
          {children}
        </row>
      </>
    );
  } else {
    return (
      <>
        <style
          css={{
            '.gutter-vertical': {
              cursor: 'row-resize',
              backgroundColor: 'grey.200',
            },
          }}
          id="split-vertical"
        />
        <column
          as={SplitPanes}
          gap={0}
          noMotion
          height="100vh"
          width="100%"
          maxWidth="100vw"
          css={css}
          asProps={{ direction, ...props }}
        >
          {children}
        </column>
      </>
    );
  }
}
