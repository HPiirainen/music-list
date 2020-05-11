import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AvatarImage from './AvatarImage';
import GenreList from './GenreList';

const styles = theme => ({
  largeImage: {
    width: theme.spacing(25),
    height: theme.spacing(25),
  },
});

class ArtistResultListItem extends Component {

  handleClick = () => {
    const { artist, onSelectArtist } = this.props;
    onSelectArtist(artist);
  }

	render = () => {
    const { artist } = this.props;
    if (Object.keys(artist).length === 0) {
      return (null);
    }
    return (
      <ListItem button component="a" onClick={this.handleClick}>
        <ListItemAvatar>
          <AvatarImage
            images={artist.images}
            alt={artist.name}
            imageSize="medium"
            fallback={<MusicNoteIcon style={{ fontSize: 42 }} />} />
        </ListItemAvatar>
        <ListItemText
          primary={artist.name}
          secondary={<GenreList genres={artist.genres} showN={3} />} />
      </ListItem>
    )
  }
}

ArtistResultListItem.propTypes = {
  artist: PropTypes.object.isRequired,
  onSelectArtist: PropTypes.func.isRequired,
}

export default withStyles(styles)(ArtistResultListItem);