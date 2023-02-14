import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Box,
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
  useTheme,
  Zoom,
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AlbumIcon from '@mui/icons-material/Album';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PeopleIcon from '@mui/icons-material/People';
import AvatarImage from './AvatarImage';
import ArtistResultListItem from './ArtistResultListItem';
import { TArtist, TGenre, TList, TListItem } from '../types/types';

export interface MusicListItemProps {
  item: TListItem;
  listActions: TList[];
  activeGenres: Set<TGenre>;
  relatedArtists: TArtist[];
  onDeleteItem: (item: TListItem) => void;
  onMoveItem: (item: TListItem, list: string) => void;
  onGetRelated: (id: string | undefined) => void;
  onClearRelated: () => void;
}

const MusicListItem: React.FC<MusicListItemProps> = ({
  item,
  listActions,
  activeGenres,
  relatedArtists,
  onDeleteItem,
  onMoveItem,
  onGetRelated,
  onClearRelated,
}) => {
  const [selectedList, setSelectedList] = useState('');
  const [listDialogOpen, setListDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const theme = useTheme();

  if (
    activeGenres.size > 0 &&
    !item.artist.genres.some((g) => activeGenres.has(g))
  ) {
    return null;
  }

  const hasAlbum = () => item.album !== null;

  const getYear = (dateString: string | undefined) =>
    new Date(dateString || '').getFullYear();

  const getAlbum = () => {
    if (hasAlbum()) {
      return (
        <>
          <AvatarImage
            images={item.album?.images}
            alt={item.album?.name}
            imageSize="medium"
            fallback={<AlbumIcon sx={{ fontSize: 42 }} />}
          />
          <Typography component="h4" variant="h6">
            {item.album?.name}{' '}
            <small>({getYear(item.album?.releaseDate)})</small>
          </Typography>
          <Typography variant="body1">{item.album?.tracks} tracks</Typography>
        </>
      );
    }
    return '';
  };

  const getItemType = () => {
    if (hasAlbum()) {
      return <Chip color="primary" icon={<AlbumIcon />} label="Album" />;
    }
    return <Chip color="primary" icon={<MusicNoteIcon />} label="Artist" />;
  };

  const getLists = () => {
    return listActions.map((list) => (
      <FormControlLabel
        value={list._id}
        key={list._id}
        control={<Radio color="secondary" />}
        label={list.title}
      />
    ));
  };

  const getTooltip = () => {
    const locale = 'fi';
    let created = '&ndash;';
    let updated = '&ndash;';
    if (item.createdAt) {
      created = new Date(item.createdAt).toLocaleString(locale);
    }
    if (item.updatedAt) {
      updated = new Date(item.updatedAt).toLocaleString(locale);
    }
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
    const related = relatedArtists.map((artist) => {
      return (
        <ArtistResultListItem
          key={artist.id}
          artist={artist}
          showGenres={false}
        />
      );
    });
    return <List>{related}</List>;
  };

  return (
    <Accordion
      sx={{
        marginBottom: theme.spacing(2.5),
        marginTop: theme.spacing(2.5),
      }}
      TransitionProps={{ unmountOnExit: true }}
      square
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <AvatarImage
            images={item.artist.images}
            alt={item.artist.name}
            imageSize="medium"
            fallback={<MusicNoteIcon sx={{ fontSize: 42 }} />}
          />
          <Typography component="h3" variant="h4">
            {item.artist.name}
          </Typography>
          <Tooltip title={getTooltip()} TransitionComponent={Zoom} arrow>
            {getItemType()}
          </Tooltip>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginRight: theme.spacing(4.5),
          }}
        >
          {getAlbum()}
        </Box>
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
            <DialogContent>{getRelatedContent()}</DialogContent>
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
            <RadioGroup onChange={(e) => setSelectedList(e.target.value)}>
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
              onClick={() => {
                setListDialogOpen(false);
                onMoveItem(item, selectedList);
              }}
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

export default MusicListItem;
