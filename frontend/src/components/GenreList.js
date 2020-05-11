import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Genre from './Genre';

class GenreList extends Component {

	render = () => {
    const { genres, showN } = this.props;
    if (!genres) {
      return (null)
    }
    const andMore = genres.length - showN;
    const genreItems = genres.slice(0, showN).map(genre => (
      <Genre key={genre} genre={genre} />
    ));
    return (
      <React.Fragment>
        { genreItems }
        { andMore > 0 &&
          <small> + { andMore } more</small>
        }
      </React.Fragment>
    )
  }
}

GenreList.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.string).isRequired,
  showN: PropTypes.number,
}

export default GenreList;