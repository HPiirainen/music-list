import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  List,
  Divider,
} from '@material-ui/core';
import ArtistResultListItem from './ArtistResultListItem';

class ArtistResultList extends Component {

	render = () => {
    const { artists, onSelectArtist } = this.props;
    let content = '';
    if (artists.length) {
      const items = artists.map(artist => (
        <React.Fragment key={artist.id}>
          <ArtistResultListItem artist={artist} onSelectArtist={onSelectArtist} />
          <Divider component="li" />
        </React.Fragment>
      ));
      content = <List>{ items }</List>
    }
    return (
      <Box>
        { content }
      </Box>
    )
  }
}

ArtistResultList.propTypes = {
  artists: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelectArtist: PropTypes.func.isRequired,
}

export default ArtistResultList;