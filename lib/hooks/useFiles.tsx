import React from 'react';
import { fixPath } from '../utils';
import { useLocalStorage } from './useLocalStorage';

export function useFiles(directory: string, initialFiles: any) {
  const [files, setFiles] = useLocalStorage(directory, initialFiles);
  const filesRef = React.useRef<{ [key: string]: string }>(files);
  filesRef.current = files;
  const setFile = React.useCallback(
    (path: string, value: string) => {
      setFiles((files: any) => ({ ...files, [fixPath(path)]: value }));
    },
    [setFiles]
  );
  const getFile = (path: string) => files[fixPath(path)];
  return { filesRef, setFile, getFile };
}
