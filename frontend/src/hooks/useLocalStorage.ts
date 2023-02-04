import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValueFactory?: () => T
): [T, (newValue: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.localStorage.getItem(key);
      console.log('getting from local storage');
      if (value) {
        return JSON.parse(value);
      } else {
        const initialValue = initialValueFactory ? initialValueFactory() : '';
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        console.log('setting initial value');
        return initialValue;
      }
    } catch (error) {
      console.error(`Problem getting localStorage key ${key}`, error);
      return initialValueFactory ? initialValueFactory() : undefined;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Problem setting localStorage key ${key} to`, storedValue);
    }
  }, [key, storedValue]);

  const setValue = (newValue: T) => setStoredValue(newValue);

  return [storedValue, setValue];
}
