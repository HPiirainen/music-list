import { AlertColor } from '@mui/material';

export type TMessage = {
  message?: string | string[];
  type?: AlertColor | undefined;
};

export type TGenre = string;

export type TExternalUrls = {
  spotify: string;
};

export type TList = {
  _id: string;
  items: TListItem[];
  isFixed?: boolean;
  title: string;
  description?: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TListItem = {
  _id?: string;
  id?: string;
  list?: string | null;
  artist: TArtist;
  album?: TAlbum | null;
  createdAt?: string;
  updatedAt?: string;
};

export type TImage = {
  _id: string;
  height: number;
  width: number;
  url: string;
};

export type TArtist = {
  _id?: string;
  id?: string;
  name: string;
  external_urls?: TExternalUrls;
  url?: string;
  images?: TImage[];
  genres: TGenre[];
};

export type TAlbum = {
  _id?: string;
  id?: string;
  name: string;
  external_urls?: TExternalUrls;
  url?: string;
  images?: TImage[];
  releaseDate?: string;
  release_date?: string;
  tracks?: number;
  total_tracks?: number;
};
