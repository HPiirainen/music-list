import React, { useState } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync, UseAsyncReturn } from 'react-async-hook';

interface DebounceResult {
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  searchResults: UseAsyncReturn;
}

const useDebouncedSearch = (
  searchFunction: (...args: string[]) => DebounceResult
) => {
  const [inputText, setInputText] = useState('');

  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 300)
  );

  const searchResults = useAsync(
    async () => debouncedSearchFunction(inputText),
    [debouncedSearchFunction, inputText]
  );

  return {
    inputText,
    setInputText,
    searchResults,
  };
};

export default useDebouncedSearch;
