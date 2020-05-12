import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  List,
  Divider,
  Typography,
} from '@material-ui/core';
import MusicListItem from './MusicListItem';

class MusicList extends Component {

	render = () => {
    const { list, onMoveItem } = this.props;
    let content = '';
    if (list.items.length) {
      const items = list.items.map(item => (
        <React.Fragment key={item.artistId}>
          <MusicListItem item={item} onMoveItem={onMoveItem} />
          <Divider component="li" />
        </React.Fragment>
      ));
      content = <List>{ items }</List>
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