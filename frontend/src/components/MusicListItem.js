import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
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
  },
});

const MusicListItem = props => {
  const { item, listActions, onDeleteItem, onMoveItem, classes } = props;
  const [selectedList, setSelectedList] = useState(null);
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const hasAlbum = () => item.album !== null;

  const getYear = dateString => new Date(dateString).getFullYear();

  const getAlbum = () => {
    if (hasAlbum()) {
      return (
        <>
          <AvatarImage
            images={item.album.images}
            alt={item.album.name}
            imageSize="medium"
            fallback={<AlbumIcon style={{ fontSize: 42 }} />}
          />
          <Typography variant="subtitle1">
            {item.album.name} <small>({getYear(item.album.releaseDate)})</small>
          </Typography>
          <Typography variant="subtitle2">
            {item.album.tracks} tracks
          </Typography>
        </>
      );
    }
    return '';
  };

  const getItemType = () => {
    if (hasAlbum()) {
      return (
        <Chip
          variant="outlined"
          size="small"
          color="primary"
          icon={<AlbumIcon />}
          label="Album"
        />
      );
    }
    return (
      <Chip
        variant="outlined"
        size="small"
        color="primary"
        icon={<MusicNoteIcon />}
        label="Artist"
      />
    );
  };

  const getLists = () => {
    return listActions.map(list => (
      <FormControlLabel
        value={list._id}
        key={list._id}
        control={<Radio />}
        label={list.title}
      />
    ));
  };

  const getTooltip = () => {
    const locale = 'fi';
    const created = new Date(item.createdAt).toLocaleString(locale);
    const updated = new Date(item.updatedAt).toLocaleString(locale);
    return (
      <>
        Created: {created}
        <br />
        Last updated: {updated}
      </>
    );
  };

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.centered}>
          <AvatarImage
            images={item.artist.images}
            alt={item.artist.name}
            imageSize="medium"
            fallback={<MusicNoteIcon style={{ fontSize: 42 }} />}
          />
          <Typography variant="h5">{item.artist.name}</Typography>
          <Tooltip title={getTooltip()} TransitionComponent={Zoom} arrow>
            {getItemType()}
          </Tooltip>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className={`${classes.centered} ${classes.insetRight}`}>
          {getAlbum()}
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button
          startIcon={<DeleteIcon />}
          color="secondary"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Remove
        </Button>
        <Button
          startIcon={<PlaylistAddIcon />}
          color="primary"
          onClick={() => setListDialogOpen(true)}
        >
          Move to list
        </Button>
        <Dialog open={deleteDialogOpen}>
          <DialogTitle>Permanently remove item?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Do you really want to <strong>remove</strong> this item instead of
              moving it to another list?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => setDeleteDialogOpen(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={() => onDeleteItem(item)} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={listDialogOpen}>
          <DialogTitle>Move to list</DialogTitle>
          <DialogContent dividers>
            <RadioGroup onChange={e => setSelectedList(e.target.value)}>
              {getLists()}
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setListDialogOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button
              disabled={selectedList === null}
              onClick={() => onMoveItem(item, selectedList)}
              color="primary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </AccordionActions>
    </Accordion>
  );
};

MusicListItem.propTypes = {
  item: PropTypes.object,
  listActions: PropTypes.array,
  onDeleteItem: PropTypes.func,
  onMoveItem: PropTypes.func,
};

export default withStyles(styles)(MusicListItem);
