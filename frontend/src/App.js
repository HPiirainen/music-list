import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import {
  Container,
  Box,
  List,
  Divider,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import ArtistInput from './components/ArtistInput';
import ArtistResultListItem from './components/ArtistResultListItem';
import ActiveArtist from './components/ActiveArtist';
import AlbumInput from './components/AlbumInput';
import MusicList from './components/MusicList';
import Message from './components/Message';
import './App.css';

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

const messageTypes = {
  error: 'error',
  success: 'success',
};

const App = props => {
  const { classes } = props;
  const [lists, setLists] = useState([]);
  const [activeArtist, setActiveArtist] = useState({});
  const [artistResults, setArtistResults] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState({});
  const [albums, setAlbums] = useState([]);
  const [artistQuery, setArtistQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({});

  const apiBaseUrl = 'http://localhost:5000';

  useEffect(() => {
    loadListItems();
  }, []);

  useEffect(() => {
    // setArtistResults([]);
    fetchArtistAlbums();
    setArtistQuery('');
  }, [activeArtist]);

  useEffect(() => {
    setAlbums([]);
    addActiveToList(getDefaultListId());
    // Way to handle when cleared / empty?
  }, [activeAlbum]);

  useEffect(() => {
    fetchArtists();
  }, [artistQuery]);

  const loadListItems = async () => {
    setLoading(true);
    const readListsUrl = `${apiBaseUrl}/lists`;
    const readItemsUrl = `${apiBaseUrl}/items`;
    Promise.all([axios.get(readListsUrl), axios.get(readItemsUrl)])
      .then(
        axios.spread((...responses) => {
          const allItems = responses[1].data;
          const lists = responses[0].data.map(list => {
            const items = allItems.filter(item => item.list === list._id);
            return { ...list, items };
          });
          setLists(lists);
        })
      )
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDefaultListId = () => {
    const defaultList = lists.find(list => list.isDefault);
    return defaultList ? defaultList._id : null;
  };

  const deleteItem = item => {
    const deleteItemUrl = `${apiBaseUrl}/items/delete/${item._id}`;
    setLoading(true);
    axios
      .delete(deleteItemUrl)
      .then(response => {
        loadListItems();
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  const moveItemToList = (item, listId) => {
    const updateItemUrl = `${apiBaseUrl}/items/update/${item._id}`;
    setLoading(true);
    axios
      .put(updateItemUrl, { list: listId })
      .then(response => {
        loadListItems();
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  };

  const fetchArtists = () => {
    if (artistQuery.length === 0) {
      setArtistResults([]);
      return;
    }
    const artistSearchUrl = `${apiBaseUrl}/spotify/artist/${artistQuery}`;
    axios
      .get(artistSearchUrl)
      .then(response => {
        setArtistResults(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchArtistAlbums = () => {
    if (Object.keys(activeArtist).length === 0) {
      // better way to do this?
      return;
    }
    const albumSearchUrl = `${apiBaseUrl}/spotify/artist/${activeArtist.id}/albums`;
    axios
      .get(albumSearchUrl)
      .then(response => {
        setAlbums(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const setArtist = artist => {
    setActiveArtist(artist);
  };

  const setAlbum = album => {
    setActiveAlbum(album);
  };

  const constructItemFromState = () => {
    const artist = {
      id: activeArtist.id,
      name: activeArtist.name,
      url: activeArtist.href,
      images: activeArtist.images,
      genres: activeArtist.genres,
    };

    let album = null;

    if (hasActiveAlbum) {
      album = {
        id: activeAlbum.id,
        name: activeAlbum.name,
        url: activeAlbum.href,
        images: activeAlbum.images,
        releaseDate: activeAlbum.release_date,
        tracks: activeAlbum.total_tracks,
      };
    }

    return {
      artist,
      album,
    };
  };

  const hasActiveAlbum = Object.keys(activeAlbum).length > 0;

  const hasActiveArtist = Object.keys(activeArtist).length > 0;

  const addActiveToList = (listId = null) => {
    if (!hasActiveArtist) {
      return;
    }
    const item = constructItemFromState();
    item.list = listId || getDefaultListId();
    setLoading(true);
    const createItemUrl = `${apiBaseUrl}/items/create`;
    axios
      .post(createItemUrl, item)
      .then(() => {
        setActiveArtist({});
        setActiveAlbum({});
        loadListItems();
      })
      .catch(error => {
        handleError(error.response.data);
      })
      .finally(() => setLoading(false));
  };

  const handleError = data => {
    if (data.name === 'ValidationError') {
      const messages = Object.values(data.errors).map(error => {
        return error.message;
      });
      messages.push('moi moi');
      const message = {
        message: messages,
        type: messageTypes.error,
      };
      setMessage(message);
    }
  };

  const clearMessage = () => {
    setMessage({});
  }

  const isArtistInputVisible = !hasActiveArtist;

  const isAlbumInputVisible = hasActiveArtist && !loading;

  const getListContent = () => {
    return lists.map(list => {
      const listActions = lists.filter(l => l._id !== list._id);
      return (
        <MusicList
          key={list._id}
          list={list}
          listActions={listActions}
          onMoveItem={moveItemToList}
          onDeleteItem={deleteItem}
        />
      );
    });
  };

  const getArtistContent = () => {
    const elements = artistResults.map(artist => (
      <React.Fragment key={artist.id}>
        <ArtistResultListItem
          key={artist.id}
          artist={artist}
          onSelectArtist={setArtist}
        />
        <Divider component="li" />
      </React.Fragment>
    ));
    return <List>{elements}</List>;
  };

  return (
    <Container maxWidth="sm" className="app">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" disableShrink />
      </Backdrop>
      <Box my={4}>
        <ArtistInput
          value={artistQuery}
          showInput={isArtistInputVisible}
          onInputChange={e => setArtistQuery(e.target.value)}
        />
        {getArtistContent()}
        <ActiveArtist
          artist={activeArtist}
          onDismiss={() => setActiveArtist({})}
          onAdd={addActiveToList}
        />
        <Box my={2}>
          <AlbumInput
            albums={albums}
            showInput={isAlbumInputVisible}
            onSelectAlbum={setAlbum}
          />
        </Box>
        {getListContent()}
      </Box>
      <Message message={message} onClear={clearMessage}></Message>
    </Container>
  );
};

export default withStyles(styles)(App);
