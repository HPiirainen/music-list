import React from 'react';
import PropTypes from 'prop-types';
import Genre from './Genre';

const GenreList = props => {
  const { genres, showN } = props;
  if (!genres) {
    return '';
  }

  const getItems = () => {
    return genres
      .slice(0, showN)
      .map(genre => <Genre key={genre} genre={genre} />);
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

GenreList.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  showN: PropTypes.number,
};

export default GenreList;
