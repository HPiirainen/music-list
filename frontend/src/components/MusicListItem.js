import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AlbumIcon from '@material-ui/icons/Album';
import AvatarImage from './AvatarImage';

class MusicListItem extends Component {

  hasAlbum = () => {
    const { item } = this.props;
    return item.albumId !== null;
  }

  getYear = (dateString) => {
    return new Date(dateString).getFullYear();
  }

	render = () => {
    const { item } = this.props;
    let title = item.artistName;
    let secondaryText = '';
    if (this.hasAlbum()) {
      title += ' – ' + item.albumName;
      secondaryText = <small>{this.getYear(item.albumReleaseDate)} | {item.albumTracksAmount} tracks</small>;
    }
    return (
      <ListItem>
        <ListItemAvatar>
          <AvatarImage
            images={item.artistImages}
            alt={item.artistName}
            imageSize="medium"
            fallback={<MusicNoteIcon style={{ fontSize: 42 }} />} />
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={secondaryText} />
        { this.hasAlbum() &&
          <ListItemSecondaryAction>
            <AvatarImage
              images={item.albumImages}
              alt={item.albumName}
              fallback={<AlbumIcon />} />
          </ListItemSecondaryAction>
        }
      </ListItem>
    )
  }
}

MusicListItem.propTypes = {
  item: PropTypes.object,
}

export default MusicListItem;