import React from 'react';
import PropTypes from 'prop-types';
import useDebouncedSearch from './useDebouncedSearch';
import { Fade, TextField, useTheme } from '@mui/material';

const ArtistInput = (props) => {
  const { artistQuery, showInput, onInputChange } = props;

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
    return '';
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

ArtistInput.propTypes = {
  artistQuery: PropTypes.string,
  showInput: PropTypes.bool,
  onInputChange: PropTypes.func,
};

export default ArtistInput;
