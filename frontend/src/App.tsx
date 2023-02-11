import React, { useState, useEffect, useReducer, useMemo } from 'react';
import axios from './utils/axios';
import Theme from './utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import {
  alpha,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Fade,
  IconButton,
  Tab,
  useTheme,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
// import { FixedSizeList } from 'react-window';
// import { InfiniteLoader } from 'react-window-infinite-loader';
import TopBar from './components/TopBar';
import GenreFilter from './components/GenreFilter';
import MusicList from './components/MusicList';
import Message from './components/Message';
import {
  TAlbum,
  TArtist,
  TGenre,
  TList,
  TListItem,
  TMessage,
} from './types/types';
import './utils/fonts';
import { AxiosError, AxiosResponse } from 'axios';
import { useAuth } from './hooks/useAuth';
import MusicListItem from './components/MusicListItem';
import SearchLayer from './components/SearchLayer';

enum AppStateActionType {
  SET_STATUS = 'set_status',
}

enum AppStateStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
  READY = 'ready',
}

interface AppState {
  status: AppStateStatus;
}

interface AppStateAction {
  type: AppStateActionType;
  payload: AppStateStatus;
}

interface ErrorData {
  name: string;
  errors: Record<string, never>;
}

const apiBaseUrl = process.env.REACT_APP_API_URL;

function createInitialAppState(): AppState {
  return {
    status: AppStateStatus.IDLE,
  };
}

const appStateReducer = (state: AppState, action: AppStateAction) => {
  const { type, payload } = action;
  console.log('appReducer', type, payload);
  if (type === AppStateActionType.SET_STATUS) {
    return {
      ...state,
      status: payload,
    };
  }
  throw new Error('Unknown appStateReducer action type: ' + action.type);
};

const App: React.FC = () => {
  // Handles loading status etc.
  const [appState, dispatchAppState] = useReducer(
    appStateReducer,
    null,
    createInitialAppState
  );
  const [searchBackdropOpen, setSearchBackdropOpen] = useState<boolean>(false);
  const [lists, setLists] = useState<TList[]>([]);
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [activeGenres, setActiveGenres] = useState<TGenre[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<TArtist[]>([]);
  const [message, setMessage] = useState<TMessage | Record<string, never>>({});
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const theme = useTheme();

  const appIsIdle = appState.status === AppStateStatus.IDLE;
  const appIsLoading = appState.status === AppStateStatus.LOADING;
  const appIsReady = appState.status === AppStateStatus.READY;
  const appIsError = appState.status === AppStateStatus.ERROR;

  useEffect(() => {
    console.log('useEffect: initial');
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      dispatchAppState({
        type: AppStateActionType.SET_STATUS,
        payload: AppStateStatus.LOADING,
      });
      const options = { signal };
      try {
        await Promise.all<AxiosResponse>([
          axios.get(`${apiBaseUrl}/items/genres`, options),
          axios.get(`${apiBaseUrl}/lists`, options),
          axios.get(`${apiBaseUrl}/items`, options),
        ]).then(([{ data: genres }, { data: lists }, { data: items }]) => {
          const newLists = lists.map((list: TList) => {
            const listItems = items.filter(
              (item: TListItem) => item.list === list._id
            );
            return { ...list, items: listItems };
          });
          setLists(newLists);
          setGenres(genres);
          if (lists.length > 0) {
            setActiveTab(lists[0]._id);
          }
          dispatchAppState({
            type: AppStateActionType.SET_STATUS,
            payload: AppStateStatus.READY,
          });
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error);
        } else if (error instanceof Error) {
          handleError(error);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  const getDefaultList = () => {
    const defaultList = lists.find((list) => list.isDefault);
    return defaultList ?? lists[0];
  };

  const getAndUpdateList = async (listId: string) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const options = { signal };
    const getListItemsUrl = `${apiBaseUrl}/items/list/${listId}`;
    const response = await axios.get(getListItemsUrl, options);
    const listItems = response.data;
    setLists((prevLists) =>
      prevLists.map((prevList) => {
        if (prevList._id === listId) {
          return { ...prevList, items: listItems };
        }
        return prevList;
      })
    );
  };

  const addToList = async (item: TListItem) => {
    setSearchBackdropOpen(false);
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
    try {
      const list = getDefaultList();
      const { _id: listId } = list;
      const controller = new AbortController();
      const signal = controller.signal;
      const options = { signal };
      const createItemUrl = `${apiBaseUrl}/items/create`;
      await axios.post(createItemUrl, { ...item, list: listId }, options);
      await getAndUpdateList(listId);
      setMessage({
        message: 'Item added successfully!',
        type: 'success',
      });
      const genres = await axios.get(`${apiBaseUrl}/items/genres`, options);
      setGenres(genres.data);
      dispatchAppState({
        type: AppStateActionType.SET_STATUS,
        payload: AppStateStatus.READY,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error);
      } else if (error instanceof Error) {
        handleError(error);
      }
    }
  };

  const deleteItem = async (item: TListItem) => {
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
    try {
      const { list: listId } = item;
      const deleteItemUrl = `${apiBaseUrl}/items/delete/${item._id}`;
      const controller = new AbortController();
      const { signal } = controller;
      const options = { signal };
      await axios.delete(deleteItemUrl, options);
      const getListItemsUrl = `${apiBaseUrl}/items/list/${listId}`;
      const response = await axios.get(getListItemsUrl, options);
      setLists((prevLists) =>
        prevLists.map((prevList) => {
          if (prevList._id === listId) {
            return {
              ...prevList,
              items: response.data,
            };
          }
          return prevList;
        })
      );
      // await getAndUpdateList(listId);
      const genres = await axios.get(`${apiBaseUrl}/items/genres`, options);
      setGenres(genres.data);
      setMessage({
        message: 'Item deleted successfully!',
        type: 'success',
      });
      dispatchAppState({
        type: AppStateActionType.SET_STATUS,
        payload: AppStateStatus.READY,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error);
      } else if (error instanceof Error) {
        handleError(error);
      }
    }
  };

  const moveItemToList = async (item: TListItem, listId: string) => {
    try {
      const controller = new AbortController();
      const { signal } = controller;
      const options = { signal };
      const updateItemUrl = `${apiBaseUrl}/items/update/${item._id}`;
      dispatchAppState({
        type: AppStateActionType.SET_STATUS,
        payload: AppStateStatus.LOADING,
      });
      await axios.put(updateItemUrl, { list: listId }, options);
      const getItemsUrl = `${apiBaseUrl}/items`;
      const { data: items } = await axios.get(getItemsUrl, options);
      const newLists = lists.map((list: TList) => {
        const listItems = items.filter(
          (item: TListItem) => item.list === list._id
        );
        return { ...list, items: listItems };
      });
      setLists(newLists);
      setMessage({
        message: 'Item updated successfully!',
        type: 'success',
      });
      dispatchAppState({
        type: AppStateActionType.SET_STATUS,
        payload: AppStateStatus.READY,
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error);
      } else if (error instanceof Error) {
        handleError(error);
      }
    }
  };

  const getRelatedArtists = (artistId: string | undefined) => {
    const relatedArtistsUrl = `${apiBaseUrl}/spotify/artist/${artistId}/related`;
    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.LOADING,
    });
    axios
      .get(relatedArtistsUrl)
      .then((response) => {
        if (response.data.length === 0) {
          setMessage({
            message: 'No related artists found.',
            type: 'error',
          });
        } else {
          setRelatedArtists(response.data);
        }
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.READY,
        });
      })
      .catch((error) => {
        handleError(error);
        dispatchAppState({
          type: AppStateActionType.SET_STATUS,
          payload: AppStateStatus.ERROR,
        });
      });
  };

  const clearRelatedArtists = () => {
    setRelatedArtists([]);
  };

  const onSetGenres = (genres: TGenre[]) => {
    setActiveGenres(genres);
  };

  const handleError = (error: Error) => {
    let messages: string | string[] = '';
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      // Unauthorized, which means our token has expired.
      // setJwt(null);
      // localStorage.removeItem('token');
      // logout();
      return;
    }

    const data = axiosError.response?.data as ErrorData;
    if (data?.name === 'ValidationError') {
      messages = Object.values<Record<string, never>>(data?.errors).map(
        (msg) => msg?.message || 'Unknown error'
      );
    } else {
      messages = axiosError.response?.statusText || error.message;
    }

    setMessage({
      message: messages,
      type: 'error',
    });

    dispatchAppState({
      type: AppStateActionType.SET_STATUS,
      payload: AppStateStatus.ERROR,
    });
  };

  // TODO: don't handle it here, handle it in the component
  const clearMessage = () => {
    setMessage({});
  };

  const tabPanels = useMemo(() => {
    return lists.map((list) => {
      const listActions = lists.filter((l) => l._id !== list._id);
      const items = list.items.map((item) => {
        return (
          <MusicListItem
            key={item._id}
            item={item}
            listActions={listActions}
            activeGenres={activeGenres}
            relatedArtists={relatedArtists}
            onMoveItem={moveItemToList}
            onDeleteItem={deleteItem}
            onGetRelated={getRelatedArtists}
            onClearRelated={clearRelatedArtists}
          />
        );
      });
      return (
        <TabPanel
          key={list._id}
          value={list._id}
          sx={{ padding: theme.spacing(3, 0) }}
        >
          <MusicList title={list.title} description={list.description}>
            {items}
          </MusicList>
        </TabPanel>
      );
    });
  }, [lists, activeGenres, relatedArtists]);

  const tabs = useMemo(() => {
    return lists.map((list) => {
      return <Tab key={list._id} label={list.title} value={list._id} />;
    });
  }, [lists]);

  const tabsContent = activeTab ? (
    <TabContext value={activeTab}>
      <TabList
        variant="fullWidth"
        onChange={(e, newValue) => setActiveTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
      >
        {tabs}
      </TabList>
      {tabPanels}
    </TabContext>
  ) : null;

  const mainContent = (
    <Container maxWidth="md" className="app">
      <Backdrop
        sx={{
          zIndex: theme.zIndex.drawer + 2,
          color: theme.palette.common.white,
          backgroundColor: alpha(theme.palette.common.black, 0.4),
        }}
        open={appIsLoading}
      >
        <CircularProgress color="inherit" disableShrink />
      </Backdrop>
      <Fade in={true} timeout={1000}>
        <Box my={4}>
          <Box my={6} display="flex" justifyContent="center">
            <IconButton
              aria-label="Open search"
              color="primary"
              onClick={() => setSearchBackdropOpen(true)}
              size="large"
            >
              <Search fontSize="large" />
            </IconButton>
          </Box>
          <Backdrop
            open={searchBackdropOpen}
            sx={{
              backgroundColor: theme.palette.common.black,
              zIndex: theme.zIndex.drawer + 1,
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              overflowY: 'auto',
            }}
          >
            {searchBackdropOpen && (
              <>
                <IconButton
                  aria-label="Close search"
                  onClick={() => setSearchBackdropOpen(false)}
                  sx={{
                    position: 'absolute',
                    top: theme.spacing(1),
                    right: theme.spacing(1),
                  }}
                  size="large"
                >
                  <Close fontSize="large" />
                </IconButton>
                <SearchLayer dispatchItem={addToList} />
              </>
            )}
          </Backdrop>
          {tabsContent}
        </Box>
      </Fade>
    </Container>
  );

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline>
        <TopBar appTitle="Musiqueue">
          <GenreFilter
            genres={genres}
            activeGenres={activeGenres}
            genreSetter={onSetGenres}
          />
        </TopBar>
        {mainContent}
        {message.message ? (
          <Message type={message.type} onClear={clearMessage}>
            {message.message}
          </Message>
        ) : null}
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
