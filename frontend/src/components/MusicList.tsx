import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import MusicListItem from './MusicListItem';
import { TArtist, TGenre, TList, TListItem } from '../types/types';

interface MusicListProps {
  list: TList;
  listActions: TList[];
  activeGenres: TGenre[];
  relatedArtists: TArtist[];
  onDeleteItem: (item: TListItem) => void;
  onMoveItem: (item: TListItem, list: string) => void;
  onGetRelated: (id: string) => void;
  onClearRelated: () => void;
}

const MusicList: React.FC<MusicListProps> = ({ list, ...childProps }) => {
  const theme = useTheme();

  // const [hasNextPage, setHasNextPage] = useState(true);
  // const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  // const [items, setItems] = useState(list.items);

  // const loadMore = () => {
  //   // TODO:
  //   // Infinite loader,
  //   // load the active list only at first,
  //   // load other lists when tab is opened.
  // };

  const getContent = () => {
    if (list.items.length) {
      return list.items.map((item) => (
        <MusicListItem
          sx={{
            marginBottom: theme.spacing(2.5),
            marginTop: theme.spacing(2.5),
          }}
          key={item._id}
          item={item}
          {...childProps}
        />
      ));
    }
    return '';
  };

  return (
    <Box my={2}>
      <Typography
        variant="h2"
        sx={{ textAlign: 'center', marginBottom: theme.spacing(1.5) }}
      >
        {list.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ textAlign: 'center', marginBottom: theme.spacing(1.5) }}
      >
        {list.description}
      </Typography>
      {getContent()}
    </Box>
  );
};

export default MusicList;
