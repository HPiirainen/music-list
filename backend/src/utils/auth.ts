import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const createJWT = (email: string, userId: Types.ObjectId, duration: number) => {
    const payload = {
        email,
        userId,
        duration
    };

    return jwt.sign(
        payload,
        process.env.TOKEN_SECRET || '',
        {
            expiresIn: duration,
        }
    );
}

export default createJWT;
