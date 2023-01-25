import React, { FormEvent, useEffect, useState } from 'react';
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
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

type Error = {
  [key: string]: string;
};

interface LoginProps {
  setToken: (token: string | null) => void;
  setMessage: (message: TMessage) => void;
  loginRoute: string;
}

// const Login: React.FC<LoginProps> = ({ setToken, setMessage, loginRoute }) => {
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Error>({});

  const { user, login } = useAuth();

  // Login if token already exists.
  if (user?.token) {
    return <Navigate to="/" />;
  }

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
    login({
      email,
      password,
    });
    // axios
    //   .post(loginRoute, {
    //     email,
    //     password,
    //   })
    //   .then((response) => {
    //     const { token } = response.data;
    //     localStorage.setItem('token', token);
    //     setToken(token);
    //     setMessage({
    //       message: 'Login successful!',
    //       type: 'success',
    //     });
    //   })
    //   .catch((err) => {
    //     if (err.response.data.errors) {
    //       setMessage({
    //         message: Object.values<string>(err.response.data.errors).filter(
    //           Boolean
    //         ),
    //         type: 'error',
    //       });
    //       setErrors(err.response.data.errors);
    //     }
    //   });
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
