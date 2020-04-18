import React from 'react';
import dynamic from 'next/dynamic';

// @ts-ignore
export const Split = dynamic(() => import('react-split'), { ssr: false });

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
          as={Split}
          gap={0}
          noMotion
          width="100%"
          maxHeight="100vh"
          css={css}
          props={{ direction, ...props }}
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
          as={Split}
          gap={0}
          noMotion
          height="100%"
          maxWidth="100vw"
          css={css}
          props={{ direction, ...props }}
        >
          {children}
        </column>
      </>
    );
  }
}
