import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
    config => {
      const { origin } = new URL(config.url);
      const allowedOrigins = [apiBaseUrl];
      const token = localStorage.getItem('token');
      if (allowedOrigins.includes(origin)) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
);

export default axios;
