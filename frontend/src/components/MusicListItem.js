import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  List,
  Radio,
  RadioGroup,
  Tooltip,
  Typography,
  Zoom,
} from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AlbumIcon from '@material-ui/icons/Album';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import PeopleIcon from '@material-ui/icons/People';
import AvatarImage from './AvatarImage';
import ArtistResultListItem from './ArtistResultListItem';

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
  const { item, listActions, activeGenres, relatedArtists, onDeleteItem, onMoveItem, onGetRelated, onClearRelated, classes } = props;
  const [selectedList, setSelectedList] = useState(null);
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (activeGenres.length && ! item.artist.genres.some(g => activeGenres.includes(g))) {
    return null;
  }

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
          <Typography component="h4" variant="h6">
            {item.album.name} <small>({getYear(item.album.releaseDate)})</small>
          </Typography>
          <Typography variant="body1">
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
          color="primary"
          icon={<AlbumIcon />}
          label="Album"
        />
      );
    }
    return (
      <Chip
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

  const getRelatedContent = () => {
    if (relatedArtists.length === 0) {
      return null;
    }
    const related = relatedArtists.map(artist => {
      return <ArtistResultListItem key={artist.id} artist={artist} showGenres={false} />;
    })
    return <List>{related}</List>;
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }} square>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.centered}>
          <AvatarImage
            images={item.artist.images}
            alt={item.artist.name}
            imageSize="medium"
            fallback={<MusicNoteIcon style={{ fontSize: 42 }} />}
          />
          <Typography component="h3" variant="h4">{item.artist.name}</Typography>
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
      <AccordionActions>
        <Button
          startIcon={<PeopleIcon />}
          variant="contained"
          color="primary"
          onClick={() => onGetRelated(item.artist.id)}
        >
          Related artists
        </Button>
        <Button
          startIcon={<DeleteIcon />}
          variant="contained"
          color="secondary"
          onClick={() => setDeleteDialogOpen(true)}
        >
          Remove
        </Button>
        <Button
          startIcon={<PlaylistAddIcon />}
          variant="contained"
          color="primary"
          onClick={() => setListDialogOpen(true)}
        >
          Move to list
        </Button>
        <Dialog open={relatedArtists.length > 0} onClose={onClearRelated}>
          <DialogTitle>Related artists</DialogTitle>
          <DialogContent>
            <DialogContent>
              {getRelatedContent()}
            </DialogContent>
          </DialogContent>
        </Dialog>
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
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onDeleteItem(item)}
              color="secondary"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={listDialogOpen}>
          <DialogTitle>Move to list</DialogTitle>
          <DialogContent>
            <RadioGroup onChange={e => setSelectedList(e.target.value)}>
              {getLists()}
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setListDialogOpen(false)}
              color="secondary"
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              disabled={selectedList === null}
              onClick={() => onMoveItem(item, selectedList)}
              color="primary"
              variant="contained"
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
  activeGenres: PropTypes.array,
  relatedArtists: PropTypes.array,
  onDeleteItem: PropTypes.func,
  onMoveItem: PropTypes.func,
  onGetRelated: PropTypes.func,
  onClearRelated: PropTypes.func,
};

export default withStyles(styles)(MusicListItem);
