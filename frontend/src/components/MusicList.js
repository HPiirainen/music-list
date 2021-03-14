import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
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
});

const MusicList = props => {
  const { list, listActions, onMoveItem, onDeleteItem, classes } = props;

  const getContent = () => {
    if (list.items.length) {
      return list.items.map(item => (
        <MusicListItem
          className={classes.list}
          key={item._id}
          item={item}
          listActions={listActions}
          onMoveItem={onMoveItem}
          onDeleteItem={onDeleteItem}
        />
      ));
    }
    return '';
  };

  return (
    <Box my={2}>
      <Typography variant="h3" className={classes.listHeading}>
        {list.title}
      </Typography>
      {getContent()}
    </Box>
  );
};

MusicList.propTypes = {
  list: PropTypes.object,
  listActions: PropTypes.array,
  onMoveItem: PropTypes.func,
};

export default withStyles(styles)(MusicList);
