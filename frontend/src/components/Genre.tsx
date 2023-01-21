import React from 'react';
import { Chip, useTheme } from '@mui/material';
import { TGenre } from '../types/types';

interface GenreProps {
  genre: TGenre;
}

const Genre = ({ genre }: GenreProps) => {
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

export default Genre;
