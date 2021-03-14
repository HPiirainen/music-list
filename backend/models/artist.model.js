const mongoose = require('mongoose');

const { Schema } = mongoose;

const Image = require('./image.model').schema;

const artistSchema = new Schema(
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
        images: [Image],
        genres: [String],
    },
);

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
module.exports.schema = artistSchema;
