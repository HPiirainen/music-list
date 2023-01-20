import axios, { AxiosHeaders } from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL ?? '';

axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url ?? '');
    const allowedOrigins: string[] = [apiBaseUrl];
    const token = localStorage.getItem('token');
    if (allowedOrigins.includes(origin)) {
      (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
