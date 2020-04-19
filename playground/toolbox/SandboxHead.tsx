import React from 'react';
import Head from 'next/head';

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
      <style
        id="base"
        css={{
          body: { margin: 0 },
          '*': {
            boxSizing: 'border-box',
          },
        }}
      />
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
    </>
  );
};
