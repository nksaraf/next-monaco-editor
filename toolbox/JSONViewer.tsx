import React from 'react';
import { monoFontStyles } from './SandboxHead';
import dynamic from 'next/dynamic';
import { important } from 'magic-components';

export const jsonViewerTheme = {
  base00: 'white', //background color
  base01: 'white', // edit background
  base02: '#ecebec',
  base03: '#444',
  base04: 'purple',
  base05: '#555555',
  base06: 'red',
  base07: '#1F61A0', //property
  base08: '#555555',
  base09: '#D64292', //string
  base0A: '#555555',
  base0B: '#2882F9', // float
  base0C: '#8B2BB9', //index
  base0D: '#555', // arrow
  base0E: '#397D13', //boolean, collapsed arrow, add icon
  base0F: '#2882F9', //number, clipboard
};

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
