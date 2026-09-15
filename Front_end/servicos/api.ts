import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.1.159:3000/', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
