import React from 'react';
import themes from './themes';
import Spectrum from 'react-spectrum';
import { EditorProps } from './Editor';

export function Loading({
  children,
  style = {},
  className = 'next-monaco-editor-loading',
}: React.PropsWithChildren<{ style?: any; className?: string }>) {
  return (
    <div
      data-editor="next-monaco-editor-loading"
      className={className}
      style={{ display: 'flex', height: '100%', ...style }}
    >
      {children}
    </div>
  );
}
export const SpectrumLoading = (props: EditorProps) => {
  const { theme: themeName, options = {} } = props;
  const theme = typeof themeName === 'string' ? themes[themeName] : themeName;
  let colors = (Array.from(
    new Set(
      theme.rules.map((r: any) => (r.foreground ? `#${r.foreground}` : ''))
    ).values()
  ) as string[]).filter((v) => v.length > 0);
  if (colors.length < 3) {
    colors = colors.concat(['#757575', '#999999', '#0871F2', '#BF5AF2']);
  }
  const backgroundColor = theme?.colors?.['editor.background'] ?? '#1e1e1e';
  const lineNumberColor =
    theme?.colors?.['editorLineNumber.foreground'] ??
    ({ 'vs-dark': '#858585', vs: '#237893', 'hc-black': 'white' } as any)[
      theme.base
    ];
  const { fontSize = 12, lineHeight = fontSize * 1.5 } = options;
  const lines = (props.defaultValue || props.value || '').split('\n');
  const paddingLeft = options.lineNumbers === 'off' ? 26 : 62;
  const width = Math.min(
    Math.max(
      Math.max(...lines.map((l) => l.length).sort((a, b) => b - a)) *
        0.6 *
        fontSize,
      250
    ),
    Number(props.width) - paddingLeft - 50 || 500
  );

  return (
    <Loading>
      <div
        style={{
          position: 'relative',
          width: '100%',
          padding: (lineHeight - fontSize) / 2,
          paddingLeft,
          paddingTop: 12,
          backgroundColor,
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: paddingLeft,
            paddingTop: 12,

            left: 0,
            top: 0,
          }}
        >
          <div
            style={{
              margin: '0 auto',
              width: fontSize - 2,
              borderRadius: '8px',
              backgroundColor: lineNumberColor,
              height: lines.length * lineHeight,
            }}
          ></div>
        </div>
        <Spectrum
          width={width}
          wordWidths={[
            fontSize * 2,
            fontSize * 3,
            fontSize * 5,
            fontSize * 7.5,
          ]}
          wordDistances={[10, 15, 12]}
          wordRadius={20}
          linesPerParagraph={lines.length}
          wordHeight={fontSize}
          lineDistance={lineHeight - fontSize}
          colors={colors}
        />
      </div>
    </Loading>
  );
};