import mongoose, { Schema, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import Artist, { IArtist, SArtist } from './artist.model';
import Album, { IAlbum, SAlbum } from './album.model';

interface IListItem {
    _id: Types.ObjectId;
    id: string;
    list: Types.ObjectId;
    artist: IArtist;
    album?: IAlbum;
}

const listItemSchema: Schema<IListItem> = new Schema<IListItem>(
    // Schema keys
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        list: {
            type: Schema.Types.ObjectId,
            ref: 'List',
            required: true,
        },
        artist: {
            type: SArtist,
            required: true,
        },
        album: SAlbum,
    },
    // Options
    {
        timestamps: true,
    },
);

listItemSchema.plugin(uniqueValidator, {
    message: 'This artist and / or album already exists!',
});

const ListItem = mongoose.model<IListItem>('ListItem', listItemSchema);

export default ListItem;
