import 'react-tippy/dist/tippy.css';

import NextApp from 'next/app';
import Link from 'next/link';
import { GraphQLogo, FaunaDBLogo } from 'sandboxes/Logos';
import { Tooltip } from 'react-tippy';
import { AnimateSharedLayout } from 'magic-components';

export default class QwertyApp extends NextApp {
  render() {
    const { Component, pageProps, router } = this.props;

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
        <row height="100vh" width="100vw">
          <AnimateSharedLayout>
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
          </AnimateSharedLayout>
          <AnimateSharedLayout>
            <div height="full" flex={1} maxWidth="calc(100vw - 64px)">
              <Component {...pageProps} />
            </div>
          </AnimateSharedLayout>
        </row>
      </>
    );
  }
}

const Nav = ({ children }: React.PropsWithChildren<{}>) => {
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

function NavItem({ title, icon: Icon, active, href, accent }: any) {
  return (
    <Tooltip
      arrow={true}
      animation="scale"
      title={title}
      position="right"
      duration={100}
      trigger="mouseenter"
    >
      <Link href={href}>
        <button
          animate
          outline="none"
          cursor="pointer"
          position="relative"
          border="none"
          bg="transparent"
          width="full"
          px={3}
          py={3}
        >
          {active && (
            <div
              top={0}
              layoutId="indicator"
              borderLeft={`solid 3px ${accent}`}
              height="100%"
              zIndex={1}
              width="100%"
              position="absolute"
              left={0}
              backgroundColor={`${accent}30`}
            ></div>
          )}
          <div zIndex={2} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Icon color="white" />
          </div>
        </button>
      </Link>
    </Tooltip>
  );
}
