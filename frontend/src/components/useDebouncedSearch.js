import { useState } from 'react';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { useAsync } from 'react-async-hook';

const useDebouncedSearch = (searchFunction) => {
    const [inputText, setInputText] = useState('');

    const debouncedSearchFunction = useConstant(() => 
        AwesomeDebouncePromise(searchFunction, 200)
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
}

export default useDebouncedSearch;
