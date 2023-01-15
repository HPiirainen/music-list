import mongoose, { Schema, Types } from 'mongoose';
import { IImage, SImage } from './image.model';

export interface IArtist {
    id: string;
    name: string;
    url?: string;
    images?: Types.DocumentArray<IImage>;
    genres?: Types.Array<string>;
}

export const SArtist: Schema<IArtist> = new Schema<IArtist>(
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
        genres: [String],
    },
);

const Artist = mongoose.model<IArtist>('Artist', SArtist);

export default Artist;
