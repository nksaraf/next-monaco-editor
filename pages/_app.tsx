import 'next-monaco-editor/css/monaco.css';
import 'react-tippy/dist/tippy.css';

import NextApp from 'next/app';
import Link from 'next/link';
import { GraphQLogo, FaunaDBLogo } from 'playground/Logos';
import { Tooltip } from 'react-tippy';

const Navigation = ({ router }) => {
  return (
    <column
      width="64px"
      minWidth="64px"
      height="full"
      gap={0}
      bg="blueGrey.900"
    >
      <Tooltip
        arrow={true}
        animation="scale"
        title={'GraphQL Sandbox'}
        position="right"
        duration={100}
        // style={{ fontFamily: RUBIK }}
        trigger="mouseenter"
      >
        <Link href="/graphql">
          <button
            outline="none"
            cursor="pointer"
            border="none"
            borderLeft={
              router.pathname === '/graphql'
                ? 'solid 3px #D64292'
                : 'solid 3px transparent'
            }
            bg={router.pathname === '/graphql' ? '#D6429230' : 'transparent'}
            width="full"
            px={3}
            py={3}
          >
            <div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
              <GraphQLogo color="white" />
            </div>
          </button>
        </Link>
      </Tooltip>
      <Tooltip
        arrow={true}
        animation="scale"
        title={'FaunaDB Sandbox'}
        position="right"
        duration={100}
        // style={{ fontFamily: RUBIK }}
        trigger="mouseenter"
      >
        <Link href="/faunadb">
          <button
            outline="none"
            cursor="pointer"
            border="none"
            borderLeft={
              router.pathname === '/faunadb'
                ? 'solid 3px #3642ce'
                : 'solid 3px transparent'
            }
            bg={router.pathname === '/faunadb' ? '#3642ce30' : 'transparent'}
            width="full"
            px={3}
            py={3}
          >
            <div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
              <FaunaDBLogo color="white" />
            </div>
          </button>
        </Link>
      </Tooltip>
    </column>
  );
};

export default class QwertyApp extends NextApp {
  render() {
    const { Component, pageProps, router } = this.props as any;
    return (
      <row height="100vh" width="100vw">
        <Navigation router={router} />
        <div height="full" width="100%" flex={1}>
          <Component {...pageProps} />
        </div>
      </row>
    );
  }
}
