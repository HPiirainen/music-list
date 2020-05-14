import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions,
  Divider,
  Chip,
  Button,
  Typography,
  Tooltip,
  Zoom,
} from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AlbumIcon from '@material-ui/icons/Album';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import CheckIcon from '@material-ui/icons/Check';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import AvatarImage from './AvatarImage';

const styles = theme => ({
  centered: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  insetRight: {
    marginRight: theme.spacing(4.5),
  }
});

class MusicListItem extends Component {

  handleDeleteItem = () => {
    const { item, onDeleteItem } = this.props;
    onDeleteItem(item);
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

  getDateFromSeconds = (seconds) => {
    return new Date(seconds * 1000).toLocaleString();
  }

	render = () => {
    const { item, classes } = this.props;
    let album = '';
    const tooltipText = (
      <React.Fragment>
        Created: {this.getDateFromSeconds(item.createdAt._seconds)}<br />
        Last updated: {this.getDateFromSeconds(item.lastUpdatedAt._seconds)}
      </React.Fragment>
    )
    let itemType = <Chip variant="outlined" size="small" color="primary" icon={<MusicNoteIcon />} label="Artist" />;
    if (this.hasAlbum()) {
      album = (
        <React.Fragment>
          <AvatarImage
            images={item.albumImages}
            alt={item.albumName}
            imageSize="medium"
            fallback={<AlbumIcon style={{ fontSize: 42 }} />} />
          <Typography variant="subtitle1">{ item.albumName } <small>({this.getYear(item.albumReleaseDate)})</small></Typography>
          <Typography variant="subtitle2">{ item.albumTracksAmount } tracks</Typography>
        </React.Fragment>
      );
      itemType = <Chip variant="outlined" size="small" color="primary" icon={<AlbumIcon />} label="Album" />;
    }
    itemType = (
      <Tooltip title={tooltipText} TransitionComponent={Zoom} arrow>
        { itemType }
      </Tooltip>
    );
    const DeleteButton = <Button key="delete" startIcon={<DeleteIcon />} color="secondary" onClick={this.handleDeleteItem}>Remove</Button>
    const HistoryButton = <Button key="history" startIcon={<CheckIcon />} color="primary" onClick={this.handleMoveToHistory}>To listened</Button>;
    const LongTermButton = <Button key="longterm" startIcon={<AccessTimeIcon />} color="primary" onClick={this.handleMoveToLongTerm}>To long-term</Button>;
    const QueueButton = <Button key="queue" startIcon={<PlaylistAddIcon />} color="primary" onClick={this.handleMoveToQueue}>To queue</Button>;
    let itemActions = [DeleteButton];
    switch(item.listId) {
      case 1: // queue
        itemActions = (
          [...itemActions, HistoryButton, LongTermButton]
        );
        break;
      case 2: // listened
        itemActions = (
          [...itemActions, QueueButton, LongTermButton]
        )
        break;
      case 3: // long-term
        itemActions = (
          [...itemActions, QueueButton, HistoryButton]
        )
        break;
      default:
        itemActions = '';
    }
    return (
        <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}>
            <div className={classes.centered}>
              <AvatarImage
                images={item.artistImages}
                alt={item.artistName}
                imageSize="medium"
                fallback={<MusicNoteIcon style={{ fontSize: 42 }} />} />
              <Typography variant="h5">{ item.artistName }</Typography>
              { itemType }
            </div>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div className={`${classes.centered} ${classes.insetRight}`}>
              { album }
            </div>
          </ExpansionPanelDetails>
          <Divider />
          <ExpansionPanelActions>
            { itemActions }
          </ExpansionPanelActions>
        </ExpansionPanel>
    )
  }
}

MusicListItem.propTypes = {
  item: PropTypes.object,
  handleDeleteItem: PropTypes.func,
  onMoveItem: PropTypes.func,
}

export default withStyles(styles)(MusicListItem);