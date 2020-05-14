import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
} from '@material-ui/core';
import MusicListItem from './MusicListItem';

const styles = theme => ({
  list: {
    marginBottom: theme.spacing(2.5),
    marginTop: theme.spacing(2.5),
  },
  listHeading: {
    textAlign: 'center',
    marginBottom: theme.spacing(1.5),
  }
});

class MusicList extends Component {
	render = () => {
    const { list, onMoveItem, onDeleteItem, classes } = this.props;
    let content = '';
    if (list.items.length) {
      content = list.items.map(item => (
        <MusicListItem className={classes.list} key={item.itemId} item={item} onMoveItem={onMoveItem} onDeleteItem={onDeleteItem} />
      ));
    }
    return (
      <Box my={2}>
        <Typography variant="h3" className={classes.listHeading}>{list.title}</Typography>
        { content }
      </Box>
    )
  }
}

MusicList.propTypes = {
  list: PropTypes.object,
  onMoveItem: PropTypes.func,
}

export default withStyles(styles)(MusicList);