import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const ArtistInput = props => {
  const { showInput, onInputChange } = props;
  const [query, setQuery] = useState('');

  useEffect(() => {
    onInputChange(query);
  }, [query]);

  if (!showInput) {
    return '';
  }

  return (
    <TextField
      id="artist-search"
      label="Search for artist"
      variant="outlined"
      fullWidth
      value={query}
      onChange={e => setQuery(e.target.value)}
    />
  );
};

ArtistInput.propTypes = {
  showInput: PropTypes.bool,
  onInputChange: PropTypes.func,
};

export default ArtistInput;
