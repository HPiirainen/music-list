import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import {
  Container,
  Box,
  List,
  ListItem,
  Divider,
  Backdrop,
  CircularProgress,
  Button,
} from '@material-ui/core';
import TopBar from './components/TopBar';
import GenreFilter from './components/GenreFilter';
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
  const [genres, setGenres] = useState([]);
  const [activeGenres, setActiveGenres] = useState([]);
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
    loadGenres();
  }, []);

  useEffect(() => {
    fetchArtistAlbums();
    setArtistQuery('');
  }, [activeArtist]);

  useEffect(() => {
    setAlbums([]);
    addActiveToList(getDefaultListId());
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
        handleError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadGenres = () => {
    axios.get(`${apiBaseUrl}/items/genres`)
      .then(response => {
        setGenres(response.data);
      })
      .catch(error => {
        handleError(error);
      });
  }

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
        loadGenres();
        setMessage({
          message: 'Item deleted successfully!',
          type: messageTypes.success,
        });
      })
      .catch(error => {
        handleError(error);
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
        loadGenres();
        setMessage({
          message: 'Item updated successfully!',
          type: messageTypes.success,
        });
      })
      .catch(error => {
        handleError(error);
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
        handleError(error);
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
        handleError(error);
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
      url: activeArtist.external_urls.spotify,
      images: activeArtist.images,
      genres: activeArtist.genres,
    };

    let album = null;

    if (hasActiveAlbum) {
      album = {
        id: activeAlbum.id,
        name: activeAlbum.name,
        url: activeAlbum.external_urls.spotify,
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
        loadGenres();
        setMessage({
          message: 'Item added successfully!',
          type: messageTypes.success,
        });
      })
      .catch(error => {
        handleError(error);
      })
      .finally(() => setLoading(false));
  };

  const onSetGenres = (genres) => {
    setActiveGenres(genres);
  }

  const handleError = error => {
    if (error.response) {
      console.log(error.response);
      if (error.response.data.name === 'ValidationError') {
        const messages = Object.values(error.response.data.errors).map(err => {
          return err.message;
        });
        setMessage({
          message: messages,
          type: messageTypes.error,
        });
      } else {
        setMessage({
          message: error.response.statusText,
          type: messageTypes.error,
        });
      }
    } else {
      // Other error, show generic error message
      setMessage({
        message: error.message,
        type: messageTypes.error,
      });
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
          activeGenres={activeGenres}
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
    <div>
      <TopBar appTitle="Musiqueue">
        <GenreFilter genres={genres} activeGenres={activeGenres} genreSetter={onSetGenres} />
      </TopBar>
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
    </div>
  );
};

export default withStyles(styles)(App);
