import mongoose, { Schema, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IList {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    isFixed: boolean;
    isDefault: boolean;
}

const listSchema: Schema<IList> = new Schema<IList>(
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

const List = mongoose.model<IList>('List', listSchema);

export default List;
