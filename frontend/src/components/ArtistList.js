import React, { Component } from 'react';
import {
  Box,
  List,
  Divider,
} from '@material-ui/core';
import Artist from './Artist';

class ArtistList extends Component {

	render = () => {
    const { artists, onSelectArtist } = this.props;
    let content = '';
    if (artists.length) {
      const items = artists.map(artist => (
        <React.Fragment key={artist.id}>
          <Artist type="list" artist={artist} onSelectArtist={onSelectArtist}></Artist>
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

export default ArtistList;