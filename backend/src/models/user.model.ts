import mongoose, { Types, Schema } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    password: string;
    _id?: Types.ObjectId;
}

const userSchema: Schema<IUser> = new Schema<IUser>(
    // Schema keys
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
