import React, { useState } from 'react';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import MusicListItem from './MusicListItem';

const styles = theme => ({
  list: {
    marginBottom: theme.spacing(2.5),
    marginTop: theme.spacing(2.5),
  },
  listHeading: {
    textAlign: 'center',
    marginBottom: theme.spacing(1.5),
  },
  listDescription: {
    textAlign: 'center',
    marginBottom: theme.spacing(1.5),
  },
});

const MusicList = props => {
  const { list, classes, ...childProps } = props;

  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [items, setItems] = useState(list.items);

  const loadMore = () => {
    // TODO:
    // Infinite loader,
    // load the active list only at first,
    // load other lists when tab is opened.
  }

  const getContent = () => {
    if (list.items.length) {
      return list.items.map(item => (
        <MusicListItem
          className={classes.list}
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
      <Typography variant="h2" className={classes.listHeading}>
        {list.title}
      </Typography>
      <Typography variant="body1" className={classes.listDescription}>{list.description}</Typography>
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

export default withStyles(styles)(MusicList);
