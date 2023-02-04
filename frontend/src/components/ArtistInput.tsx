import React from 'react';
import useDebouncedSearch from '../hooks/useDebouncedSearch';
import { Fade, TextField, useTheme } from '@mui/material';

interface ArtistInputProps {
  artistQuery: string;
  showInput: boolean;
  onInputChange: (text: string) => void;
}

const ArtistInput: React.FC<ArtistInputProps> = ({
  artistQuery,
  showInput,
  onInputChange,
}) => {
  const useArtistSearch = () =>
    useDebouncedSearch((text) => onInputChange(text));

  const { setInputText } = useArtistSearch();

  const theme = useTheme();

  const inputStyles = {
    textAlign: 'center',
    fontSize: 60,
    color: theme.palette.primary.main,
  };

  if (!showInput) {
    return null;
  }

  return (
    <Fade in={true} timeout={{ enter: 0, exit: 500 }}>
      <TextField
        id="artist-search"
        placeholder="Search artist"
        color="primary"
        autoFocus
        fullWidth
        value={artistQuery}
        variant="standard"
        onChange={(e) => setInputText(e.target.value)}
        inputProps={{
          sx: inputStyles,
          autoComplete: 'off',
        }}
      />
    </Fade>
  );
};

export default ArtistInput;
