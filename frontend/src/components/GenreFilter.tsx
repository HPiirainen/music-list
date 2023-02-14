import React, { useLayoutEffect, useState } from 'react';
import { List, ListSubheader } from '@mui/material';
import ListSwitch from './ListSwitch';
import { TGenre } from '../types/types';

interface GenreFilterProps {
  availableGenres: TGenre[];
  activeGenres: Set<TGenre>;
  onSelectGenres: (newSelectedGenres: Set<TGenre>) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  availableGenres,
  activeGenres,
  onSelectGenres,
}) => {
  const [selectAll, setSelectAll] = useState(true);

  useLayoutEffect(() => {
    if (activeGenres.size === 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [activeGenres]);

  useLayoutEffect(() => {
    if (selectAll) {
      onSelectGenres(new Set());
    }
  }, [selectAll]);

  const handleToggleAll = () => {
    setSelectAll(!selectAll);
  };

  const handleToggle = (genre: TGenre) => {
    const newSelected = new Set(activeGenres);
    if (newSelected.has(genre)) {
      newSelected.delete(genre);
    } else {
      newSelected.add(genre);
    }
    onSelectGenres(newSelected);
  };

  if (availableGenres.length === 0) {
    return null;
  }

  return (
    <List subheader={<ListSubheader disableSticky>Genres</ListSubheader>}>
      <ListSwitch
        key="select-all"
        label="Toggle all"
        identifier="select-all"
        isChecked={selectAll}
        onSwitch={handleToggleAll}
        isDisabled={activeGenres.size === 0}
      />
      {availableGenres.map((genre) => {
        return (
          <ListSwitch
            key={genre}
            label={genre}
            identifier={genre}
            isChecked={activeGenres.has(genre)}
            onSwitch={() => handleToggle(genre)}
          />
        );
      })}
    </List>
  );
};

export default GenreFilter;
