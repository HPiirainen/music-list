import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
import MessageType from '../utils/MessageType';

const Login = (props) => {
  const { setToken, setMessage, loginRoute } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const hasError = (field) => {
    if ('message' in errors && errors.message) {
      return true;
    }
    if (field in errors) {
      return Boolean(errors[field]);
    }
    return false;
  };

  const signIn = (e) => {
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
          type: MessageType.Success,
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.errors) {
          setMessage({
            message: Object.values(err.response.data.errors).filter(Boolean),
            type: MessageType.Error,
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

Login.propTypes = {
  setToken: PropTypes.func,
  setMessage: PropTypes.func,
  loginRoute: PropTypes.string,
};

export default Login;
