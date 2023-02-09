import React, { useRef, useState } from 'react';
import debounce from 'awesome-debounce-promise';
// import { useAsync } from 'react-async-hook';
// import useDebouncedSearch from '../hooks/useDebouncedSearch';
import { Fade, TextField, useTheme } from '@mui/material';

interface ArtistInputProps {
  showInput: boolean;
  onInputChange: (text: string) => void;
}

const ArtistInput: React.FC<ArtistInputProps> = ({
  showInput,
  onInputChange,
}) => {
  if (!showInput) {
    return null;
  }

  const [inputText, setInputText] = useState('');
  const inputRef = useRef(inputText);

  const handleChange = (value: string) => {
    if (inputRef.current === value) {
      onInputChange(value);
    }
  };

  // TODO: Move to hook?
  // TODO: Memoize?
  const debouncedSearchFunction = debounce(
    async (value) => handleChange(value),
    500
  );

  const theme = useTheme();

  const inputStyles = {
    textAlign: 'center',
    fontSize: 60,
    color: theme.palette.primary.main,
  };

  return (
    <Fade in={true} timeout={{ enter: 0, exit: 500 }}>
      <TextField
        id="artist-search"
        placeholder="Search artist"
        color="primary"
        autoFocus
        fullWidth
        value={inputText}
        variant="standard"
        onChange={(e) => {
          inputRef.current = e.target.value;
          setInputText(e.target.value);
          debouncedSearchFunction(e.target.value);
        }}
        inputProps={{
          sx: inputStyles,
          autoComplete: 'off',
        }}
      />
    </Fade>
  );
};

export default ArtistInput;
