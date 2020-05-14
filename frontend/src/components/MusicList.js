import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
} from '@material-ui/core';
import MusicListItem from './MusicListItem';

class MusicList extends Component {
	render = () => {
    const { list, onMoveItem, onDeleteItem } = this.props;
    let content = '';
    if (list.items.length) {
      content = list.items.map(item => (
        <MusicListItem key={item.itemId} item={item} onMoveItem={onMoveItem} onDeleteItem={onDeleteItem} />
      ));
    }
    return (
      <Box my={2}>
        <Typography variant="subtitle1">{list.title}</Typography>
        { content }
      </Box>
    )
  }
}

MusicList.propTypes = {
  list: PropTypes.object,
  onMoveItem: PropTypes.func,
}

export default MusicList;