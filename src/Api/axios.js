import axios from 'axios';
import { BASEURL } from './Api';
import Cookie from 'cookie-universal';
import handleApiError from './handleApiError';

const cookies = Cookie();

export const Axios = axios.create({
  baseURL: BASEURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token = cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
