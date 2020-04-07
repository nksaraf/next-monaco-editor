import React from 'react';

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
