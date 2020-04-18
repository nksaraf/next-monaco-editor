import React from 'react';
import { fixPath } from 'next-monaco-editor/utils';
import { useLocalStorage } from './useLocalStorage';

export function useFiles(initialFiles: any) {
  const [files, setFiles] = useLocalStorage('files', initialFiles);
  const filesRef = React.useRef<object>(files);
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
