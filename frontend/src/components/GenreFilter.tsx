import React, { useState, useEffect } from 'react';
import { List, ListSubheader } from '@mui/material';
import ListSwitch from './ListSwitch';
import { TGenre } from '../types/types';

interface GenreFilterProps {
  genres: TGenre[];
  activeGenres: TGenre[];
  genreSetter: (genre: TGenre[]) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  activeGenres,
  genreSetter,
}) => {
  const [allSelected, setAllSelected] = useState(true);

  useEffect(() => {
    if (activeGenres.length === 0) {
      // Check select all if no genres checked
      toggleSelectAll(true);
    } else {
      // Otherwise keep unchecked
      toggleSelectAll(false);
    }
  }, [activeGenres]);

  useEffect(() => {
    // If select all was checked, empty checked genres
    if (allSelected) {
      genreSetter([]);
    }
  }, [allSelected]);

  const toggleSelectAll = (state: boolean) => {
    setAllSelected(state);
  };

  const switchGenre = (state: boolean, genre: TGenre) => {
    let genres: TGenre[];
    if (state) {
      genres = [...activeGenres, genre];
    } else {
      genres = [...activeGenres].filter((g) => g !== genre);
    }
    genreSetter(genres);
  };

  const listItems = genres.map((genre, index) => {
    const genreIsActive = activeGenres.includes(genre);
    return (
      <ListSwitch
        key={index}
        label={genre}
        identifier={index}
        isChecked={genreIsActive}
        onSwitch={switchGenre}
      />
    );
  });

  if (genres.length === 0) {
    return null;
  }

  return (
    <List subheader={<ListSubheader disableSticky>Genres</ListSubheader>}>
      <ListSwitch
        key="select-all"
        label="Show all"
        identifier="select-all"
        isChecked={allSelected}
        onSwitch={toggleSelectAll}
      />
      {listItems}
    </List>
  );
};

export default GenreFilter;
