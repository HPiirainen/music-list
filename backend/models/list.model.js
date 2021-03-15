const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const listSchema = new Schema(
    // Schema keys
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        isFixed: {
            type: Boolean,
            default: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        }
    },
    // Options
    {
        timestamps: true,
    },
);

listSchema.plugin(uniqueValidator, {
    message: 'A list with the same name already exists.',
});

const List = mongoose.model('List', listSchema);

module.exports = List;
