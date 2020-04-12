export function processSize(size) {
  size = String(size);
  return !/^\d+$/.test(size) ? size : `${size}px`;
}

export function processDimensions(width, height) {
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
