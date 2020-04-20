import React, { useState } from 'react';
// Hook
export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  overrideInitial: boolean = false
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }

      if (overrideInitial) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = React.useCallback(
    (value: T) => {
      try {
        setStoredValue((storedValue) => {
          // Allow value to be a function so we have same API as useState
          const valueToStore =
            value instanceof Function ? value(storedValue) : value;
          // Save to local storages
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Save state
          return valueToStore;
        });
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    },
    [setStoredValue]
  );
  return [storedValue, setValue as any];
}
