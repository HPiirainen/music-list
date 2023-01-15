import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/user.model';
import createJWT from '../utils/auth';

const router = Router();

interface Error {
    email: string | null;
    password: string | null;
    message: string | null;
}

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email: email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(422).send('Email already exists');
            } else {
                const user = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }
                        user.password = hash;
                        user.save()
                            .then(response => {
                                return res.status(200).send();
                            })
                            .catch(err => {
                                return res.status(500).json(err);
                            });
                    });
                });
            }
        })
        .catch(err => {
            return res.status(500).json(err);
        });
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const errors: Error = {
        email: null,
        password: null,
        message: null,
    };

    if (!email) {
        errors.email = 'Email is required';
    }

    if (!password) {
        errors.password = 'Password is required';
    }

    if (errors.email || errors.password) {
        return res.status(422).json({ errors });
    }

    User.findOne({ email: email })
        .then(async (user) => {
            if (!user) {
                errors.message = 'User not found';
                return res.status(404).json({ errors });
            } else {
                const passwordCorrect = await bcrypt.compare(password, user.password);
                if (!passwordCorrect) {
                    errors.password = 'Password incorrect';
                    return res.status(400).json({ errors });
                }
            }

            const accessToken = createJWT(
                user.email,
                user._id,
                12 * 60 * 60 // 12 hours
            );

            jwt.verify(
                accessToken,
                process.env.TOKEN_SECRET || '',
                (err, decoded) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    if (decoded) {
                        return res.status(200).json({
                            success: true,
                            token: accessToken,
                            userId: user._id,
                        });
                    }
                });
        }).catch(err => {
            return res.status(500).send(err);
        });
});

// TODO: Change password route.

export default router;
