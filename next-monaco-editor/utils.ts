export function processSize(size: string | number) {
  size = String(size);
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

export function processDimensions(width: string | number, height: string | number) {
  const fixedWidth = processSize(width);
  const fixedHeight = processSize(height);
  return {
    width: fixedWidth,
    height: fixedHeight,
  };
}

export const getNextWorkerPath = (label: string) => {
  return `_next/static/${label}.monaco.worker.js`;
};

export function noop() {}
