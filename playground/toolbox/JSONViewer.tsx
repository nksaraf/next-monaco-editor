import React from 'react';
import { jsonViewerTheme } from '../../pages/graphql';
import { monoFontStyles } from './SandboxHead';
import dynamic from 'next/dynamic';
import { important } from 'magic-components';

export const ReactJSON = dynamic(() => import('react-json-view'), {
  ssr: false,
});

export function JSONViewer(props: any) {
  return (
    <>
      <style
        css={{
          '.object-content span': {
            opacity: important('1.0'),
          },
          '.react-json-view': {
            ...important(monoFontStyles),
          },
          '.react-json-view input, .react-json-view textarea': {
            ...important(monoFontStyles),
            fontSize: important('11px'),
          },
        }}
        id="json-viewer"
      />
      <ReactJSON
        displayDataTypes={false}
        indentWidth={2}
        name={null}
        displayObjectSize={false}
        // collapsed={3}
        style={{
          ...important(monoFontStyles),
          height: '100%',
        }}
        {...props}
      />
    </>
  );
}

export function JSONResult({ result }: { result: object }) {
  return (
    <div p={3} height="100vh" overflow="scroll">
      {Object.keys(result).length === 0 ? (
        <div
          fontFamily={monoFontStyles.fontFamily}
          fontSize={2}
          color="grey.700"
        >
          Run a query to see results
        </div>
      ) : (
        <div minHeight="100%">
          <JSONViewer src={result} theme={jsonViewerTheme} />
        </div>
      )}
    </div>
  );
}
