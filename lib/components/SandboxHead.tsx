import React from 'react';
import Head from 'next/head';

export const styles = {
  '.monaco-menu .monaco-action-bar.vertical .action-menu-item': {
    height: '1em !important',
  },
  '.monaco-menu .monaco-action-bar.vertical': {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  '.monaco-menu .monaco-action-bar.vertical .submenu-indicator.codicon::before': {
    marginRight: '-8px !important',
  },
  '.monaco-editor *': {
    boxSizing: 'content-box',
  },
};

const MONO_FONTS = 'Roboto Mono, monospace';
export const RUBIK = 'Rubik, monospace';

export const monoFontStyles = {
  fontFamily: MONO_FONTS,
  fontSize: '12px',
  letterSpacing: '0.2px',
};

export const SandboxHead = ({ children, title }: any) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
          rel="stylesheet"
        />
        {children}
      </Head>
      <style id="monaco-base" css={styles} />
    </>
  );
};
