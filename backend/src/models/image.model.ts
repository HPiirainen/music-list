import mongoose, { Schema, Types } from 'mongoose';

export interface IImage {
    _id: Types.ObjectId;
    url: string;
    width?: number;
    height?: number;
}

export const SImage: Schema<IImage> = new Schema<IImage>(
    // Schema keys
    {
        url: {
            type: String,
            required: true,
        },
        width: Number,
        height: Number,
    },
);

const Image = mongoose.model<IImage>('Image', SImage);

export default Image;
