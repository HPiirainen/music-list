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
import './App.css';

const styles = theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

const App = props => {
  const { classes } = props;
  const [lists, setLists] = useState([]);
  const [activeArtist, setActiveArtist] = useState({});
  const [artistResults, setArtistResults] = useState([]);
  const [activeAlbum, setActiveAlbum] = useState({});
  const [albums, setAlbums] = useState([]);
  const [artistQuery, setArtistQuery] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('Render: App');

  const apiBaseUrl = 'http://localhost:5001/music-app-a2bd9/us-central1/app';

  useEffect(() => {
    loadListItems();
  }, []);

  useEffect(() => {
    // setArtistResults([]);
    // console.log('artistResults cleared');
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

  const loadListItems = () => {
    setLoading(true);
    const readAllListsUrl = `${apiBaseUrl}/api/read-lists`;
    const readAllItemsUrl = `${apiBaseUrl}/api/read-items`;
    Promise.all([axios.get(readAllListsUrl), axios.get(readAllItemsUrl)])
      .then(
        axios.spread((...responses) => {
          const items = responses[1].data;
          const lists = responses[0].data.map(list => {
            const listItems = items.filter(item => item.listId === list.id);
            return { ...list, items: listItems };
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
    return defaultList ? defaultList.id : null;
  };

  const deleteItem = item => {
    const { itemId } = item;
    const deleteItemUrl = `${apiBaseUrl}/api/delete-item/${itemId}`;
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

  const moveItemToList = (item, listId = 2) => {
    const { itemId } = item;
    const updateItemUrl = `${apiBaseUrl}/api/update-item/${itemId}`;
    setLoading(true);
    axios
      .put(updateItemUrl, { listId })
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
    const artistSearchUrl = `${apiBaseUrl}/spotify/search-artist/${artistQuery}`;
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
    const albumSearchUrl = `${apiBaseUrl}/spotify/get-artist-albums/${activeArtist.id}`;
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
    const {
      id: artistId,
      name: artistName,
      href: artistUrl,
      images: artistImages,
      genres: artistGenres,
    } = activeArtist;
    const {
      id: albumId,
      name: albumName,
      href: albumUrl,
      images: albumImages,
      release_date: albumReleaseDate,
      total_tracks: albumTracksAmount,
    } = activeAlbum;

    return {
      artistId,
      artistName,
      artistUrl,
      artistImages,
      artistGenres,
      albumId: albumId || null,
      albumName: albumName || null,
      albumUrl: albumUrl || null,
      albumImages: albumImages || null,
      albumReleaseDate: albumReleaseDate || null,
      albumTracksAmount: albumTracksAmount || null,
    };
  };

  const hasActiveArtist = Object.keys(activeArtist).length > 0;

  const addActiveToList = (listId = null) => {
    if (!hasActiveArtist) {
      return;
    }
    const item = constructItemFromState();
    item.listId = listId || getDefaultListId();
    setLoading(true);
    const createItemUrl = `${apiBaseUrl}/api/create-item`;
    axios
      .post(createItemUrl, item)
      .then(response => {
        setActiveArtist({});
        setActiveAlbum({});
        // TODO: load only changed list?
        loadListItems();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const isArtistInputVisible = !hasActiveArtist;

  const isAlbumInputVisible = hasActiveArtist && !loading;

  const getListContent = () => {
    return lists.map(list => {
      const listActions = lists.filter(l => l.id !== list.id);
      return (
        <MusicList
          key={list.id}
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
    </Container>
  );
};

export default withStyles(styles)(App);
