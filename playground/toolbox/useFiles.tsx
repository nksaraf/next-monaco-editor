import React from 'react';
import { fixPath } from 'next-monaco-editor/utils';
import { useLocalStorage } from './useLocalStorage';

export function useFiles(
  directory: string,
  initialFiles: any,
  override: boolean = false
) {
  const [files, setFiles] = useLocalStorage(
    directory + '-files',
    initialFiles,
    override
  );
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
