import mongoose, { Schema, Date, Types } from 'mongoose';
import { IImage, SImage } from './image.model';

export interface IAlbum {
    id: string;
    name: string;
    url?: string;
    images?: Types.DocumentArray<IImage>;
    releaseDate?: Date;
    tracks?: number;
}

export const SAlbum: Schema<IAlbum> = new Schema<IAlbum>(
    // Schema keys
    {
        id: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            trim: true,
        },
        images: [SImage],
        releaseDate: Date,
        tracks: Number,
    },
);

const Album = mongoose.model<IAlbum>('Album', SAlbum);

export default Album;
