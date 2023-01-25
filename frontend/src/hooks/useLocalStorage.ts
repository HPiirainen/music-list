import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T, (newValue: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.localStorage.getItem(key);
      console.log('getting from local storage');
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        console.log('setting initial value');
        return initialValue;
      }
    } catch (error) {
      console.error(`Problem getting localStorage key ${key}`);
      return initialValue;
    }
  });

  const setValue = (newValue: T) => {
    try {
      console.log('setting localStorage setValue');
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Problem setting localStorage key ${key} to`, newValue);
    }
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
}
