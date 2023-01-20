import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, useTheme } from '@mui/material';
import MusicListItem from './MusicListItem';

const MusicList = (props) => {
  const { list, ...childProps } = props;
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

MusicList.propTypes = {
  list: PropTypes.object,
  listActions: PropTypes.array,
  activeGenres: PropTypes.array,
  onMoveItem: PropTypes.func,
  onDeleteItem: PropTypes.func,
};

export default MusicList;
