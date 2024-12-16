import axios, { AxiosInstance } from 'axios';

// export const apiBackend = 'http://localhost:4444';
export const apiBackend = 'http://192.168.18.6:4444';

const api: AxiosInstance = axios.create({
  baseURL: apiBackend,
});

export default api;
