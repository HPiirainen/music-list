import { AlertColor } from '@mui/material';

export type TMessage = {
  message?: string | string[];
  type?: AlertColor | undefined;
};

export type TGenre = string;

export type TImage = {
  _id: string;
  height: number;
  width: number;
  url: string;
};

export type TArtist = {
  _id: string;
  id: string;
  name: string;
  url?: string;
  images?: TImage[];
  genres: TGenre[];
};

export type TAlbum = {
  _id: string;
  id: string;
  name: string;
  url?: string;
  images?: TImage[];
  releaseDate?: string;
  release_date?: string;
  tracks?: number;
};
