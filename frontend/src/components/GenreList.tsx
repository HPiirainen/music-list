import React from 'react';
import { TGenre } from '../types/types';
import Genre from './Genre';

interface GenreListProps {
  genres: TGenre[];
  showN: number;
}

const GenreList: React.FC<GenreListProps> = ({ genres, showN }) => {
  if (!genres) {
    return null;
  }

  const getItems = () => {
    return genres
      .slice(0, showN)
      .map((genre) => <Genre key={genre} genre={genre} />);
  };

  const getAndMore = () => {
    const andMore = genres.length - showN;
    if (andMore > 0) {
      return <span> + {andMore} more</span>;
    }
    return '';
  };

  return (
    <>
      {getItems()}
      {getAndMore()}
    </>
  );
};

export default GenreList;
