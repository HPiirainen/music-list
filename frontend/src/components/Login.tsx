import React, { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import axios from '../utils/axios';
import {
  Box,
  Button,
  Container,
  Fade,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { TMessage } from '../types/types';

type Error = {
  [key: string]: string;
};

// TODO: Accepts single or multiple strings, could be enhanced.
// type Message = {
//   message?: string | string[];
//   type?: number;
// };

interface LoginProps {
  setToken: Dispatch<SetStateAction<string | null>>;
  setMessage: Dispatch<SetStateAction<TMessage>>;
  loginRoute: string;
}

const Login = ({ setToken, setMessage, loginRoute }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Error>({});

  const hasError = (field: string) => {
    if ('message' in errors && errors.message) {
      return true;
    }
    if (field in errors) {
      return Boolean(errors[field]);
    }
    return false;
  };

  const signIn = (e: FormEvent) => {
    e.preventDefault();
    axios
      .post(loginRoute, {
        email,
        password,
      })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setMessage({
          message: 'Login successful!',
          type: 'success',
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.errors) {
          setMessage({
            message: Object.values<string>(err.response.data.errors).filter(
              Boolean
            ),
            type: 'error',
          });
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <Fade in={true} timeout={1000}>
      <Container maxWidth="xs">
        <Box pt={12}>
          <Paper elevation={6}>
            <Box p={4} textAlign="center">
              <Box mb={4}>
                <Typography component="h2" variant="h4">
                  Sign in
                </Typography>
              </Box>
              <form onSubmit={signIn} noValidate>
                <Box my={1.5}>
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    autoComplete="email"
                    value={email}
                    error={hasError('email')}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    required
                    fullWidth
                  />
                </Box>
                <Box my={1.5}>
                  <TextField
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    error={hasError('password')}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                  />
                </Box>
                <Box my={3}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Sign in
                  </Button>
                </Box>
              </form>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Fade>
  );
};

export default Login;
