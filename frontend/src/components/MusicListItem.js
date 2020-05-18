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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Tooltip,
  Zoom,
} from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AlbumIcon from '@material-ui/icons/Album';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
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
  constructor(props) {
    super(props);
    this.state = {
      listDialogOpen: false,
      selectedList: null,
      deleteDialogOpen: false,
    }
  }

  openListDialog = () => {
    this.setState({
      listDialogOpen: true,
      selectedList: null,
    });
  }

  closeListDialog = () => {
    this.setState({
      listDialogOpen: false,
      selectedList: null,
    });
  }

  handleDialogListSelect = (e) => {
    this.setState({
      selectedList: e.target.value,
    });
  }

  handleDeleteClick = () => {
    this.setState({
      deleteDialogOpen: true,
    });
  }

  closeDeleteDialog = () => {
    this.setState({
      deleteDialogOpen: false,
    });
  }

  handleDeleteItem = () => {
    const { item, onDeleteItem } = this.props;
    onDeleteItem(item);
  }

  handleListDialogOk = () => {
    const { item, onMoveItem } = this.props;
    const { selectedList } = this.state;
    onMoveItem(item, selectedList);
    this.closeListDialog();
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
    const { item, listActions, classes } = this.props;
    const { listDialogOpen, deleteDialogOpen } = this.state;
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
          <Typography variant="subtitle1">{item.albumName} <small>({this.getYear(item.albumReleaseDate)})</small></Typography>
          <Typography variant="subtitle2">{item.albumTracksAmount} tracks</Typography>
        </React.Fragment>
      );
      itemType = <Chip variant="outlined" size="small" color="primary" icon={<AlbumIcon />} label="Album" />;
    }
    itemType = (
      <Tooltip title={tooltipText} TransitionComponent={Zoom} arrow>
        {itemType}
      </Tooltip>
    );
    const lists = listActions.map(list => (
      <FormControlLabel value={list.id} key={list.id} control={<Radio />} label={list.title} />
    ));
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
            <Typography variant="h5">{item.artistName}</Typography>
            {itemType}
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={`${classes.centered} ${classes.insetRight}`}>
            {album}
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button startIcon={<DeleteIcon />} color="secondary" onClick={this.handleDeleteClick}>Remove</Button>
          <Button startIcon={<PlaylistAddIcon />} color="primary" onClick={this.openListDialog}>Move to list</Button>
          <Dialog open={deleteDialogOpen}>
            <DialogTitle>Permanently remove item?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Do you really want to <strong>remove</strong> this item instead of moving it to another list?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.closeDeleteDialog} color="primary">
                Cancel
                </Button>
              <Button onClick={this.handleDeleteItem} color="secondary">
                Delete
                </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={listDialogOpen}>
            <DialogTitle>Move to list</DialogTitle>
            <DialogContent dividers>
              <RadioGroup onChange={this.handleDialogListSelect}>
                {lists}
              </RadioGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeListDialog} color="secondary">Cancel</Button>
              <Button disabled={this.state.selectedList === null} onClick={this.handleListDialogOk} color="primary">Ok</Button>
            </DialogActions>
          </Dialog>
        </ExpansionPanelActions>
      </ExpansionPanel>
    )
  }
}

MusicListItem.propTypes = {
  item: PropTypes.object,
  listActions: PropTypes.array,
  handleDeleteItem: PropTypes.func,
  onMoveItem: PropTypes.func,
}

export default withStyles(styles)(MusicListItem);