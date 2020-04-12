import React from 'react';
import themes from './themes';
import Spectrum from 'react-spectrum';
import Color from 'color';
import { NextMonacoEditorProps } from './index';
export function Loading({
  children,
  style = {},
  className = 'next-monaco-editor-loading',
}) {
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
export const SpectrumLoading = (props: NextMonacoEditorProps) => {
  const { theme: themeName } = props;
  const theme = typeof themeName === 'string' ? themes[themeName] : themeName;
  let colors = (Array.from(
    new Set(
      theme.rules.map((r) =>
        r.foreground ? Color(`#${r.foreground}`).toString() : ''
      )
    ).values()
  ) as string[]).filter((v) => v.length > 0);
  if (colors.length < 3) {
    colors = colors.concat(['#757575', '#999999', '#0871F2', '#BF5AF2']);
  }
  const backgroundColor = theme?.colors?.['editor.background'] ?? '#1e1e1e';
  const { fontSize = 12, lineHeight = fontSize * 1.5 } = props.options;
  const lines = (props.defaultValue || props.value).split('\n');
  const paddingLeft = props.options.lineNumbers === 'off' ? 26 : 62;
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
          width: '100%',
          padding: (lineHeight - fontSize) / 2,
          paddingLeft,
          backgroundColor,
        }}
      >
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
