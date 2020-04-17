import React, { useEffect, useRef } from 'react';

function useOnClickOutside(
  ref: React.MutableRefObject<undefined>,
  handler: { (): any; (arg0: any): void }
) {
  useEffect(() => {
    const listener = (event: { target: any }) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
}

const ModalBaby = React.forwardRef(({ children }: any, ref: any) => {
  return (
    <div
      ref={ref}
      variants={{
        open: {
          opacity: 1,
        },
        closed: {
          opacity: 0,
        },
      }}
      transition={
        {
          type: 'spring',
          duration: 200,
        } as any
      }
      css={{
        position: 'fixed',
        background: 'grey.50',
        width: '50%',
        height: 'auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 4px 0 rgba(50, 50, 93, 0.1)',
      }}
    >
      {children}
    </div>
  );
});

export function Modal({ isOpen, toggle, children }: any) {
  const ref = useRef();

  useOnClickOutside(ref, () => toggle(false));

  return (
    <div
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={{
        open: {
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'block',
          // applyAtStart: {
          //   display: 'block',
          // },
        },
        closed: {
          background: 'rgba(0, 0, 0, 0)',
          display: 'none',
          // applyAtEnd: {
          //   display: 'none',
          // },
        },
      }}
      css={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
      }}
    >
      <ModalBaby ref={ref}>{children}</ModalBaby>
    </div>
  );
}
