import React from 'react';
import PropTypes from 'prop-types';
import { Chip, useTheme } from '@mui/material';

const Genre = (props) => {
  const { genre } = props;
  const theme = useTheme();
  return (
    <Chip
      key={genre}
      label={genre}
      size="small"
      color="primary"
      component="span"
      sx={{
        margin: theme.spacing(0.25),
        pointerEvents: 'none',
        '&:first-of-type': {
          marginLeft: 0,
        },
      }}
    />
  );
};

Genre.propTypes = {
  genre: PropTypes.string.isRequired,
};

export default Genre;
