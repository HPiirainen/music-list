import axios, { AxiosHeaders } from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL ?? '';

axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url ?? '');
    const allowedOrigins: string[] = [apiBaseUrl];
    if (!allowedOrigins.includes(origin)) {
      return config;
    }
    const user = localStorage.getItem('music-list:user');
    if (user) {
      const token = JSON.parse(user).token;
      (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
