import React from 'react';
import { important } from 'magic-components';
import { Tooltip } from 'react-tippy';
import { RUBIK } from './SandboxHead';

export function Button({ tooltipTitle, ...props }: any) {
  return (
    <>
      <style
        id="tooltip"
        css={{
          '.tippy-tooltip': {
            fontFamily: RUBIK,
            padding: important('8px'),
            fontSize: important('12px'),
          },
        }}
      />
      <Tooltip
        // options
        arrow={true}
        animation="scale"
        title={tooltipTitle}
        position="bottom"
        duration={200}
        style={{ fontFamily: RUBIK }}
        trigger="mouseenter"
      >
        <grid
          fontSize={7}
          as="button"
          cursor="pointer"
          border="none"
          backgroundColor="#E535AB"
          borderRadius="100px"
          height="1.5em"
          width="1.5em"
          p={2}
          boxShadow="large"
          css={{
            '&:focus': {
              outline: 'none',
            },
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          placeItems="center"
          {...props}
        />
      </Tooltip>
    </>
  );
}
