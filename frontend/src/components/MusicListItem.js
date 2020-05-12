import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AlbumIcon from '@material-ui/icons/Album';
import AvatarImage from './AvatarImage';

class MusicListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleContextMenuClick = (e) => {
    this.setState({
      anchorEl: e.currentTarget,
    });
  }

  handleContextMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  }

  handleMoveToQueue = () => {
    const { item, onMoveItem } = this.props;
    onMoveItem(item, 1);
  }

  handleMoveToHistory = () => {
    const { item, onMoveItem } = this.props;
    onMoveItem(item, 2);
  }

  handleMoveToLongTerm = () => {
    const { item, onMoveItem } = this.props;
    onMoveItem(item, 3);
  }

  hasAlbum = () => {
    const { item } = this.props;
    return item.albumId !== null;
  }

  getYear = (dateString) => {
    return new Date(dateString).getFullYear();
  }

	render = () => {
    const { item } = this.props;
    const { anchorEl } = this.state;
    let title = item.artistName;
    let images = item.artistImages;
    let fallbackIcon = <MusicNoteIcon style={{ fontSize: 42 }} />;
    let secondaryText = '';
    if (this.hasAlbum()) {
      title += ' – ' + item.albumName;
      images = item.albumImages;
      fallbackIcon = <AlbumIcon style={{ fontSize: 42 }} />;
      secondaryText = <small>{this.getYear(item.albumReleaseDate)} | {item.albumTracksAmount} tracks</small>;
    }
    let contextMenuItems;
    switch(item.listId) {
      case 1: // queue
        contextMenuItems = (
          [
            <MenuItem key="history" onClick={this.handleMoveToHistory}>To listened</MenuItem>,
            <MenuItem key="longterm" onClick={this.handleMoveToLongTerm}>To long-term</MenuItem>,
          ]
        );
        break;
      case 2: // listened
        contextMenuItems = (
          [
            <MenuItem key="queue" onClick={this.handleMoveToQueue}>To queue</MenuItem>,
            <MenuItem key="longterm" onClick={this.handleMoveToLongTerm}>To long-term</MenuItem>,
          ]
        )
        break;
      case 3: // long-term
        contextMenuItems = (
          [
            <MenuItem key="queue" onClick={this.handleMoveToQueue}>To queue</MenuItem>,
            <MenuItem key="history" onClick={this.handleMoveToHistory}>To listened</MenuItem>,
          ]
        )
        break;
    }
    return (
      <ListItem>
        <ListItemAvatar>
          <AvatarImage
            images={images}
            alt={item.artistName}
            imageSize="medium"
            fallback={fallbackIcon} />
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={secondaryText} />
        <ListItemSecondaryAction>
          <IconButton
            aria-haspopup="true"
            aria-label="Actions"
            onClick={this.handleContextMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={this.handleContextMenuClose}
          >
            { contextMenuItems }
          </Menu>
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
}

MusicListItem.propTypes = {
  item: PropTypes.object,
  onMoveItem: PropTypes.func,
}

export default MusicListItem;