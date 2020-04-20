import 'next-monaco-editor/css/monaco.css';
import 'react-tippy/dist/tippy.css';

import NextApp from 'next/app';
import Link from 'next/link';
import { GraphQLogo, FaunaDBLogo } from 'playground/Logos';
import { Tooltip } from 'react-tippy';

const Nav = ({ children }) => {
  return (
    <column
      width="64px"
      minWidth="64px"
      height="full"
      gap={0}
      bg="blueGrey.900"
    >
      {children}
    </column>
  );
};

export default class QwertyApp extends NextApp {
  render() {
    const { Component, pageProps, router } = this.props as any;
    return (
      <row height="100vh" width="100vw">
        <Nav>
          <NavItem
            title="GraphQL Sandbox"
            href="/graphql"
            active={router.pathname === '/graphql'}
            accent="#D64292"
            icon={GraphQLogo}
          />
          <NavItem
            title="FaunaDB Sandbox"
            href="/faunadb"
            active={router.pathname === '/faunadb'}
            accent="#3642ce"
            icon={FaunaDBLogo}
          />
        </Nav>
        <div height="full" flex={1} maxWidth="calc(100vw - 64px)">
          <Component {...pageProps} />
        </div>
      </row>
    );
  }
}

function NavItem({ title, icon: Icon, active, href, accent }: any) {
  return (
    <Tooltip
      arrow={true}
      animation="scale"
      title={title}
      position="right"
      duration={100}
      // style={{ fontFamily: RUBIK }}
      trigger="mouseenter"
    >
      <Link href={href}>
        <button
          outline="none"
          cursor="pointer"
          border="none"
          borderLeftStyle="solid"
          borderLeftWidth="3px"
          borderLeftColor={active ? accent : 'transparent'}
          bg={active ? `${accent}30` : 'transparent'}
          width="full"
          px={3}
          py={3}
        >
          <div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
            <Icon color="white" />
          </div>
        </button>
      </Link>
    </Tooltip>
  );
}
